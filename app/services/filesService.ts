import fs from 'fs';
import { join } from 'path';
import { HelperService } from './helperService';
import { webConfig } from '../../build/config';

export class FilesService {

	constructor(private helper: HelperService) {}

	public getGuitarTabs(): Promise<object> {
		return new Promise((resolve, reject) => {
			try {
				const folderArray = this.GetContentsByDirLocation(webConfig().fileLocations.tabsDirectory);
				resolve(folderArray);
			} catch (err) {
				reject(err);
			}
		});
	}

	// Right now this only gets first level folders and files. Does not look recursivley. Will enchance as needed
	private GetContentsByDirLocation(rootDir: string): Folder[] {
		const _this = this;
		const dirs = fs.readdirSync(rootDir).map((name) => join(rootDir, name)).filter((s) => fs.lstatSync(s).isDirectory());
		const folderArray: Folder[] = [];

		dirs.forEach((folder) => {
			const f = {
				files: [],
				name: folder.replace(rootDir, ''),
				path: rootDir,
			} as Folder;

			const files = fs.readdirSync(folder);

			files.forEach((file) => {
				const fileData = fs.statSync(join(folder, file));

				f.files.push({
					createDate: fileData.birthtime,
					editDate: fileData.mtime,
					name: file.substring(0, file.lastIndexOf('.')),
					path: folder + '/',
					size: _this.helper.formatBytes(fileData.size),
					type: file.substring(file.lastIndexOf('.'), file.length),
				} as FolderFile);
			});

			folderArray.push(f);
		});

		return folderArray;
	}
}
