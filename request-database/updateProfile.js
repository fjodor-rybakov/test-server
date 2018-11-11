export function updateProfile(database, data, path) {
    return new Promise(async (resolve, reject) => {
        console.log(path);
        const sql = `UPDATE user SET 
                            first_name = ?, 
                            last_name = ?,
                            email = ?, 
                            photo = ?
                         WHERE id_user = '${data.id_user}'`;
        await database.query(sql, [data.first_name, data.last_name, data.email, path], function (err, result) {
            if (err) {
                console.log(err);
                return reject(err);
            }
            return resolve(result);
        })
    })
}