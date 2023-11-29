import { tasks_v1 } from "@googleapis/tasks";
import { Client } from "@libsql/client";
import { OAuth2Client } from "google-auth-library";

export default async function createTaskList(
    oAuth2Client: OAuth2Client,
    taskApi: tasks_v1.Tasks,
    token: string,
    db: Client
) {
    const taskList = await taskApi.tasklists.insert({
        requestBody: { title: "todo-app" },
        auth: oAuth2Client,
    });

    const userInfo = await oAuth2Client.getTokenInfo(token);

    if (taskList.data.id && userInfo.email) {
        await db.execute({
            sql: "INSERT INTO todoLists(id, user) VALUES (@id, @user)",
            args: { id: taskList.data.id, user: userInfo.email },
        });
    }

    return taskList.data.id;
}
