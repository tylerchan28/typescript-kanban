import ProjectItem from "./ProjectItem";
import { Project } from "../models/project-model";

interface Props {
    projects: Project[];
}


function Project({ projects }: Props) {
    return (
        <div>
            {
                projects.map((project: Project, index: number) => {
                    return (
                        <ProjectItem project={project} key={index} />
                    )
                })
            }
        </div>
    )
}


export default Project;
