import { tasks } from "@googleapis/tasks";
import { NextRequest, NextResponse } from "next/server";
import { oAuth2Client } from "../../auth/route";
import { type Client, createClient } from "@libsql/client";
import createTodoList from "./createTodoList";
type Task = {
    id: string;
    desc: string;
    prio: string;
    synced: boolean;
};

interface RequestData {
    tasks: Task[];
    toRemove: Task[];
}

let db: null | Client = null;

export async function POST(req: NextRequest) {
    try {
        if (!db) {
            db = createClient({
                url: process.env.DB_URL!,
                authToken: process.env.DB_KEY!,
            });
        }
        const taskApi = tasks("v1");
        const headers = new Headers(req.headers);
        const authHeader = headers.get("Authorization");
        if (!authHeader) {
            return NextResponse.json(
                { message: "error invalid authorization header" },
                { status: 400 }
            );
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return NextResponse.json(
                { message: "missing access token" },
                { status: 400 }
            );
        }
        oAuth2Client.setCredentials({ access_token: token });
        taskApi.context._options = { auth: oAuth2Client };
        const userInfo = await oAuth2Client.getTokenInfo(token);
        if (!userInfo.email) {
            return NextResponse.json(
                { message: "invalid access token" },
                { status: 400 }
            );
        }
        console.log("executing select statement");
        const taskListId = await db.execute({
            sql: "SELECT DISTINCT id FROM todoLists WHERE user = ?",
            args: [userInfo.email],
        });
        console.log(taskListId);
        let listId: string | null | undefined;
        if (taskListId.rows.length === 0) {
            listId = await createTodoList(oAuth2Client, taskApi, token, db);
        } else {
            listId = taskListId.rows[0]["id"] as string;
        }
        if (!listId) {
            return NextResponse.json(
                { message: "unable to obtain taskList id" },
                { status: 500 }
            );
        }
        let body = await req.json();
        console.log(body);
        if (!body) {
            return NextResponse.json(
                { message: "request missing body" },
                { status: 400 }
            );
        }

        const clientTasks: RequestData = body;

        const list = await taskApi.tasks.list({
            tasklist: listId!,
        });

        let gapiTaskList = list.data.items;
        if (!gapiTaskList) {
            return NextResponse.json(
                { message: "error fetching gapi tasklist" },
                { status: 500 }
            );
        }
        console.log(gapiTaskList);

        // remove toRemove tasks from the gapi taskList
        for (const task of clientTasks.toRemove) {
            if (task.synced) {
                try {
                    console.log(
                        `deleting task ${task.id} from taskList ${listId}`
                    );
                    await taskApi.tasks.delete({
                        tasklist: listId!,
                        task: task.id,
                    });
                    gapiTaskList = gapiTaskList!.filter((curr) => {
                        return curr.id !== task.id;
                    });
                } catch (error) {
                    console.log("Error removing tasks from TaskList");
                }
            }
        }

        // add new tasks from client that aren't in the gapi taskList yet
        for (const task of clientTasks.tasks) {
            if (!task.synced) {
                try {
                    console.log(`inserting task into tasklist: ${task.desc}`);
                    const insertRes = await taskApi.tasks.insert(
                        { tasklist: listId! },
                        {
                            body: JSON.stringify({
                                notes: `prio: ${task.prio}`,
                                title: task.desc,
                            }),
                        }
                    );
                    console.log("data: ", insertRes.data);
                    gapiTaskList!.push(insertRes.data);
                } catch (error) {
                    console.log(error);
                }
            }
        }
        console.log(gapiTaskList);
        const resTasks = gapiTaskList.map((curr) => {
            let prio = curr.notes?.split(" ")[1];
            const task: Task = {
                id: curr.id!,
                desc: curr.title!,
                prio: prio!,
                synced: true,
            };
            return task;
        });

        return NextResponse.json(
            {
                message: "successfully synced todos",
                data: JSON.stringify(resTasks),
            },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
