import { Status } from "../models/card-model";

export default [{
    projectId: 1,
    userId: 1,
    projectName: "test",
    todo: [{ id: 1, description: "Implement draggable", status: Status[0]}, { id: 2, description: "Test", status: Status[0]} ],
    inProgress: [{ id: 3, description: "Front end design", status: Status[1]}, { id: 5, description: "in progress test", status: Status[1]} ],
    completed: [{ id: 4, description: "Project page skeleton", status: Status[2]}, { id: 6, description: "completed test", status: Status[2]}]
},
{
    projectId: 2,
    userId: 1,
    projectName: "test2",
    todo: [],
    inProgress: [],
    completed: []
},{
    projectId: 3,
    userId: 2,
    projectName: "test3",
    todo: [],
    inProgress: [],
    completed: []
}]