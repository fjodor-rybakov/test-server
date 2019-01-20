import * as errors from "restify-errors";

export class FeedbackServices {
    async createFeedback(database, id_user, id_task, data) {
        let sql = `INSERT comment VALUES (null, ?, ?, ?)`;
        const options = [id_user, id_task, data];

        return await database.query(sql, options)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message);
            });
    }

    async getAllFeedback(database, id_task) {
        let sql = `SELECT * FROM comment
                   LEFT JOIN user ON user.id_user = comment.id_user
                   WHERE id_task = ?`;
        const options = [id_task];

        return await database.query(sql, options)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message);
            });
    }

    async updateFeedback(database, data,  id_comment) {
        let sql = `UPDATE comment SET text = ? WHERE id_comment = ?`;
        const options = [data, id_comment];

        return await database.query(sql, options)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message);
            });
    }

    async deleteFeedback(database, id_comment) {
        let sql = `DELETE FROM comment WHERE id_comment = ?`;
        const options = [id_comment];

        return await database.query(sql, options)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message);
            });
    }
}