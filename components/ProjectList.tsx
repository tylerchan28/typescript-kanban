import ProjectItem from "./ProjectItem";
import { Project } from "../models/project-model";

interface Props {
    projects: Project[];
}

function Project({ projects }: Props) {
    // add types for projects when pulling from db
    return (
        <div>
            {
                projects.map((project: Project) => {
                    return (
                        <ProjectItem project={project} key={project.projectId} />
                    )
                })
            }
        </div>
    )
}

export default Project;