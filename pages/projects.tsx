import Head from 'next/head'
import ProjectList from '../components/ProjectList'
import exampleProjects from "../fixtures/projectExample";
import { Project } from '../models/project-model';
// import { useEffect, useState } from "react";
import next from 'next';
const { Client } = require('pg');


interface Props {
  projects: Project[],
  id: number
}
function projects({ projects, id }: Props) {

  // const [id, setId] = useState("");

  // useEffect(() => {
  //   axios.get("/success")
  //     .then((res) => setId(res.data[0].user_id))
  // }, [id])

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div> Welcome {id}</div>
      <div className="container">
        <div>
          <ProjectList projects={projects}/>
        </div>
      </div>
    </div>
  )
}


export const getServerSideProps = async (context: any) => {
  let id, projects;
  console.log(context.req.user.email)
  const client = new Client({
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  });  
  client.connect((err: Error) => {
    if (err) {
      console.log(err);
    } else {
      console.log('connected to PostgreSQL');
    }
  });
  client.query("SELECT user_id FROM users WHERE email = ($1)", [context.req.user.email], (err: Error, results: any) => {
    if (err) throw err;
    id = results.rows[0].user_id;
    client.query(`SELECT * FROM projects WHERE projects.user_id = ${id}`, (err: Error, results: any) => {
      if (err) throw err
      projects = results.rows
    })
  });

  return {
    props: {
      projects: projects ? projects : [],
    }
  }
}

export default projects;

// use axios to get projects from the database