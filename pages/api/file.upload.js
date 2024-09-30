import formidable from "formidable"
import { promises as fsPromises } from "fs";
import path from "path"

export const config = {
    api: {
        bodyParser: false,
    }
}

export default async function handler(req,res){
    switch (req.method) {
        case "POST":{
            const form = formidable({
                uploadDir: path.join(process.cwd(),'/public/file_uploads'),
                maxFileSize: Infinity,
                keepExtensions: true,
            })

            form.parse(req, async (err, fields, files) => {
                if (err) {
                    return res.status(500).json({ error: "Failed to upload file"})
                }

                const file = files.file
                const filePath = path.join(process.cwd(),"uploads",file.newFilename)

                // Move the file to the desired folder
                await fsPromises.rename(file.filePath, filePath)
                
                return res.status(200).json({
                    message: "File uploaded successfully",
                    filePath,
                })
            })
            break;
        }
            
        case "GET": {
            const files = await fsPromises.readdir(path.join(process.cwd(), "uploads"));
            return res.json(files);
        }


        default:{
            res.setHeader("Allow", ["POST", "GET"]);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    }
}
