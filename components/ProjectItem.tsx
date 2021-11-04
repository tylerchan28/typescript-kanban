import Link from "next/link";

// Project is an object being passed as props, so must define project as well
interface Props {
    project: {
        projectId: number;
        userId: number;
        projectName: string;
    }
}


function ProjectItem ({ project }: Props) {
    return (
        <Link href={`/project/${project.projectId}`} as={`/project/${project.projectId}`}>
        {/* <Link href="/project/[id]" as={`/project/${project.projectId}`}></Link> */}
        {/* understand why square bracket is used for routing and if it is optimal (gives 404 error) */}
           <a>
               Name: {project.projectName} <br/>
               Project Id: {project.projectId} <br/><br/>
           </a>
        </Link>
    )
}

export default ProjectItem;