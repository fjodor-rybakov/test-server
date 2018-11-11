export function updateProfile(database, data, path) {
    return new Promise(async (resolve, reject) => {
        console.log(path);
        const sql = `UPDATE user SET 
                            first_name = '${data.first_name}', 
                            last_name = '${data.last_name}',
                            email = '${data.email}', 
                            photo = '${path}'
                         WHERE id_user = '${data.id_user}'`;
        await database.query(sql, function (err, result) {
            if (err) {
                console.log(err);
                return reject(err);
            }
            return resolve(result);
        })
    })
}