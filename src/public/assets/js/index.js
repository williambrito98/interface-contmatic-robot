window.addEventListener('load', () => {
    const form = document.querySelector('#formulario')

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const servidor = e.target.querySelector('#servidor').value
        const codigo = e.target.querySelector('#codigo').value
        const ano = e.target.querySelector("button[data-id='ano']").title
        const mes = e.target.querySelector("button[data-id='mes']").title

        const body = {
            servidor,
            codigo: codigo.split(',').map(item => item.trim()),
            ano: ano.split(',').map(item => item.trim()),
            mes: mes.split(',').map(item => item.trim())
        }

        if (!isEmpty(servidor, codigo, ano, mes)) {
            alert('Todos os campos devem estar preenchidos')
            return false
        }

        fetch('/run', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        }).then(response => {
            if (response.status === 200) {
                response.json()
                    .then(json => {
                        if (json.status === 200) {
                            alert('Dados enviados com sucesso')
                            window.location.href = '/'
                            return
                        }

                        if (json.status === 500) {
                            console.log(json.message)
                            alert(json.message)
                            return
                        }
                    })
            }
        })
    })


    function isEmpty(...args) {
        const empty = args.filter(item => item === '')

        if (empty.length !== 0) return false

        return true
    }
})
