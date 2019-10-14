import fs from 'fs';
import { join } from 'path';
import { HelperService } from './helperService';
import { errorConfig, webConfig } from '../config';

export class FilesService {

	constructor(private helper: HelperService) {}

	public getGuitarTabs(): Promise<Folder[]> {
		return new Promise((resolve, reject) => {
			try {
				const folderArray = this.GetContentsByDirLocation(webConfig().fileLocations.tabsDirectory);
				resolve(folderArray);
			} catch (err) {
				reject(err);
			}
		});
	}

	public getFile(type: number, path: string, fileName: string): Promise<FolderFile> {
		return new Promise((resolve, reject) => {
			try {
				let typeDirectory = '/';

				if (type === 1) {// Tabs Directory
					typeDirectory = webConfig().fileLocations.tabsDirectory;
				} else {
					reject(errorConfig.invalidFileType(type));
				}

				const folder = typeDirectory + path;
				const fData = fs.readFileSync(join(folder, fileName), 'utf8');

				resolve(this.setFileData(folder, fileName, typeDirectory, fData));
			} catch (err) {
				reject(errorConfig.unableToRetrieveFile(type, path, fileName));
			}
		});
	}

	// Right now this only gets first level folders and files. Does not look recursivley. Will enchance as needed
	private GetContentsByDirLocation(rootDir: string): Folder[] {
		const dirs = fs.readdirSync(rootDir).map((name) => join(rootDir, name)).filter((s) => fs.lstatSync(s).isDirectory());
		const folderArray: Folder[] = [];

		dirs.forEach((folder) => {
			const f = {
				files: [],
				name: folder.replace(rootDir, ''),
				path: '/',
			} as Folder;

			const files = fs.readdirSync(folder);

			files.forEach((fileName) => {
				f.files.push(this.setFileData(folder, fileName, rootDir));
			});

			folderArray.push(f);
		});

		return folderArray;
	}

	private setFileData(folder: string, fileName: string, rootDir: string, data?: string): FolderFile {
		const fileData = fs.statSync(join(folder, fileName));

		return {
			createDate: fileData.birthtime,
			editDate: fileData.mtime,
			fileData: data,
			name: fileName.substring(0, fileName.lastIndexOf('.')),
			path: `${folder.replace(rootDir, '')}${folder.charAt(folder.length - 1) === '/' ? '' : '/'}`,
			size: this.helper.formatBytes(fileData.size),
			type: fileName.substring(fileName.lastIndexOf('.'), fileName.length),
		} as FolderFile;
	}
}
