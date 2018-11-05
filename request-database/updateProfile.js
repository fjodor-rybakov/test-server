export function updateProfile(database, data) {
    return new Promise(async (resolve, reject) => {
        const sql = `UPDATE user SET 
                            first_name = '${data.first_name}', 
                            last_name = '${data.last_name}',
                            email = '${data.email}' 
                         WHERE id_user = '${data.id_user}'`;
        await database.query(sql, function (err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        })
    })
}