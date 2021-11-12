export async function getUserData(email: string, client: any) {
  let projects, id: any;
  client.query("SELECT user_id FROM users WHERE email = ($1)", [email], (err: Error, results: any) => {
    if (err) {console.log(err)};
    client.query(`SELECT * FROM projects WHERE projects.user_id = ${results.rows[0].user_id}`, (err: Error, results: any) => {
      if (err) {console.log(err)};
      projects = results.rows
    })
  });
  const getId = new Promise((resolve, reject) => {
    resolve(client.query('SELECT user_id FROM users WHERE email = ($1)', [email]));
  })
  await getId
    .then((results: any) => {
      id = results.rows[0].user_id;
    });
  const getProjects = new Promise((resolve, reject) => {
    resolve(client.query(`SELECT * FROM projects WHERE projects.user_id = ${id}`));
  })
  await getProjects
    .then((results: any) => {
      projects = results.rows;
    });
  return { projects: projects, id: id }
}