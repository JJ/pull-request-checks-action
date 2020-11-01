const checklist = /\s*\-\s+\[\s*([xX]?)\s*\]\s+(.+?)\.\s+/mg;


export async function checks(body: string ): Promise<{ [id:string] : boolean}> {
    return new Promise(() => {
        let checked : { [id:string] : boolean} = {}
        const match = checklist.exec(body)
        while (match != null) {
            checked[match[2]] = match[1]?true:false
            match = checklist.exec(body)
        }
        return match
    })
}
