// Single project page
import { useRouter } from "next/router";
import projectFixture from "../../fixtures/projectExample";
import styles from "../../styles/project.module.css";
import { Project } from "../../models/project-model";
import TodoCard from "../../components/TodoCard";
// will eventually use state from projects
interface Props {
    project: Project
}
// for todos, inprogress, completed arrays, map the objects to a component (make later)
// those components need to be draggable and have the logic to switch around the statuses
const project = ({ project }: Props) => {
    const router = useRouter();
    const { projectId } = router.query;

    return (
        <div>
            <div>{project.projectName}</div>
            <div>Project {projectId}</div>
            <div className={styles.main}>
                <div className={styles.status}>
                    <div>To Do</div>
                    <button>Add todo</button>
                    <div> 
                        {project.todo.map((todo) => <TodoCard todo={todo} key={todo.id}/>)}
                    </div>
                </div>
                <div className={styles.status}>
                    <div>In Progress</div>
                    <div>
                        {project.inProgress.map((todo) => <TodoCard todo={todo} key={todo.id}/>)} 
                    </div>
                </div>
                <div className={styles.status}>
                    <div>Completed</div>
                    <div>
                        {project.completed.map((todo) => <TodoCard todo={todo} key={todo.id}/>)} 
                    </div>
                </div>
            </div>
        </div>
    )
}

// Used to get data from server 
// Filter the project that matches the context.params.projectId from the database
// need to use axios/async function
export const getServerSideProps = (context: any) => {
    const res = projectFixture;
    const projectArr = res.filter((data) => data.projectId === parseInt(context.params.projectId))
    const project = projectArr[0];
    return {
        props: {
            project
        }
    }
}

export default project;