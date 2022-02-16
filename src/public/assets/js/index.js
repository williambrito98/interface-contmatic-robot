window.addEventListener('load', () => {
    const form = document.querySelector('#formulario')

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const servidor = e.target.querySelector('#servidor').value
        const codigo = getValuesInMultipleSelect('#codigo')
        const anos = getValuesInMultipleSelect("#ano")
        const mes = getValuesInMultipleSelect("#mes")

        const body = {
            servidor,
            codigo,
            anos,
            mes
        }

        console.log(body)

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


    function getValuesInMultipleSelect(selector) {
        const el = document.querySelector(selector).selectedOptions
        console.log(el)
        const array = []
        for (let index = 0; index < el.length; index++) {
            array.push(el[index].value)
        }

        return array
    }


    function isEmpty(...args) {
        const empty = args.filter(item => item.length !== 0)

        if (empty.length !== args.length) return false

        return true
    }
})
