import {updateProfile} from "../request-database/updateProfile";
import * as errs from "restify-errors";
import {getProfile} from "../request-database/getProfile";
import fs from "fs";
import {authorization} from "../utils/authorization";

export class Profile {
	static async getProfileData(database, req, res, next) {
		const dataUser = await authorization(req, res, next);
		const id_user = dataUser.id_user;
		getProfile(database, id_user, next)
			.then((data) => {
				if (data[0].photo === "") {
					res.send(data[0]);
				}

				Profile.checkPhoto(data[0].photo)
					.then((path) => {
						fs.readFile(path, {encoding: "base64"}, (err, result) => {
							const newData = data[0];
							newData.photo = "data:image/png;base64," + result;
							res.send(newData);
						});
					});
			});
	}

	static async updateProfile(database, req, res, next) {
		await authorization(req, res, next);
		const data = req.body;
		const base64Data = data.photo.replace(/^data:image\/png;base64,/, "");
		let path = "resources/photo_" + data.id_user + ".png";
		if (data.photo !== "") {
			await fs.writeFile(path, base64Data, "base64", (err) => {
				console.log(err);
			});
		}

		await Profile.checkPhoto(path)
			.then((data) => {
				return path = data;
			});

		updateProfile(database, data, path, next)
			.then(() => {
				res.send("success");
			})
			.catch(() => {
				return next(new errs.InvalidArgumentError("Request database error"));
			});
	}

	static checkPhoto(path) {
		return new Promise((resolve) => {
			fs.readFile(path, {encoding: "base64"}, (err) => {
				if (err) {
					return resolve("resources/default-avatar.png");
				}
				return resolve(path);
			});
		});
	}
}