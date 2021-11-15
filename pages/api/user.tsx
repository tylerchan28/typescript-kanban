export async function getUserData(email: string, client: any) {
  let projects, id: any;
  const getId = new Promise((resolve, _) => {
    resolve(client.query('SELECT user_id FROM users WHERE email = ($1)', [email]));
  })
  await getId
    .then((results: any) => {
      id = results.rows[0].user_id;
    });
  const getProjects = new Promise((resolve, _) => {
    resolve(client.query(`SELECT * FROM projects WHERE projects.user_id = ${id}`));
  })
  await getProjects
    .then((results: any) => {
      projects = results.rows;
    });
  return { projects, id }
}