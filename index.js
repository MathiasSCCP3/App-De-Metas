const {select, input, checkbox} = require("@inquirer/prompts")
const fs = require("fs").promises

let msg = "Bem Vindo Ao App De Metas"

let metas

const carregarMetas = async () => {
    try{
        const dados = await fs.readFile("metas.json", "utf8")
        metas = JSON.parse(dados)
    }
    catch(erro) {
        metas = []
    }
}

const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

const CadastrarMeta = async () => {
    const meta = await input({ message: "Qual meta deseja cadastrar?"  })        
    if(meta.length == 0){
        msg = "A meta não pode ser vazia"
        return
    }

    metas.push(
        {value: meta, checked: false }
    )
}

const ListarMetas = async () => {
    if (metas.length == 0){
        msg = "Não existem metas"
        return
    }
    const respostas = await checkbox({
        choices: [...metas]
    })
    metas.forEach((m) => {
        m.checked = false
    })
    if(respostas.length == 0){
        msg = "Nenhuma meta foi selecionada"
        return
    } 
    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })
        meta.checked = true
    })

    msg = "Meta marcada como concluida"

}

const MetasRealizadas = async () => {
    if (metas.length == 0){
        msg = "Não existem metas"
        return
    }

    const mrz = metas.filter((meta) => {
        return meta.checked
    })
    
    if(mrz.length == 0){
        msg = "Nenhuma meta foi realizada"
        return
    }

    await select({
        message: "Metas realizadas",
        choices: [...mrz]
    })
}

const MetasAbertas = async () => {
    if (metas.length == 0){
        msg = "Não existem metas"
        return
    }

    const mab = metas.filter((meta) => {
        return !meta.checked
    })
    if(mab.length == 0){
        msg = "Nenhuma meta está aberta"
        return
    }
    await select({
        message: "Metas abertas",
        choices: [...mab]
    })
}

const DeletarMetas = async () => {
    if (metas.length == 0){
        msg = "Não existem metas"
        return
    }
    
    const MetasDesmarcadas = metas.map((meta) => {
        meta.checked = false
        return meta
    })

    const delet = await checkbox({
        choices: [...metas]
    })
    if(delet.length == 0){
        msg = "Nenhuma meta foi deletada"
        return
    }
    delet.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        })
        msg = "Meta(s) deletada(s)"
    })
    }

    const LimparConsole = () => {
        console.clear()

        if(msg != ""){
            console.log("")
            console.log(msg)
            msg = ""
        }
    }
const start = async () => {
    await carregarMetas()
    while(true){
        LimparConsole()
        await salvarMetas()
    
        const opcao = await select({
            message: "Menu:",
            choices:[{
                name: "Cadastrar Meta",
                value: "Cadastrar"
            },
            {
                name: "Listar Metas",
                value: "Listar"
            },
            {
                name: "Metas Realizadas",
                value: "Metas Realizadas"
            },
            {
                name: "Metas Abertas",
                value: "Metas Abertas"
            },
            {
                name : "Deletar Metas",
                value: "Deletar Metas"
            },
            {
                name: "Sair",
                value: "Sair"
            }
       ]    

    })
        switch(opcao){
            case "Cadastrar":
                await CadastrarMeta()
                break
            case 'Listar':
                await ListarMetas()
                break
            case "Metas Realizadas":
                await MetasRealizadas() 
                break
            case "Metas Abertas":
                await MetasAbertas()
                break
            case "Deletar Metas":
                await DeletarMetas()
                break
            case "Sair":
                console.log("Saindo...")
                return
        }
        
    }
}
start()
