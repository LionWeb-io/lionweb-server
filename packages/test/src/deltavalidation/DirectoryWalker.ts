import fs from "fs";

export interface DirectoryWorker {
    visitDir(dir: string): void
    visitFile(file: string): void
}

export class ValidationWorker implements DirectoryWorker {
    visitDir(dir: string): void {
    }

    visitFile(file: string): void {
        const message = JSON.parse(fs.readFileSync(file).toString());
        console.log("Found file " + file)
    }
}

export class DirectoryWalker {
    worker: DirectoryWorker

    constructor(worker: DirectoryWorker) {
        this.worker = worker
    }

    walk(dir: string): void {
        if(fs.existsSync(dir)) {
            if (fs.lstatSync(dir).isDirectory()) {
                this.worker.visitDir(dir)
                const files = fs.readdirSync(dir)
                for (const file of files) {
                    console.log("walk.file "  + file)
                    this.walk(dir + "/" + file)
                }
            } else if (fs.lstatSync(dir).isFile()) {
                this.worker.visitFile(dir)
            }
        }
    }
}
