# Referências

## Libs levantadas:

### promise-limit:
    https://www.npmjs.com/package/promise-limit
        Por que não foi testada?
            Precisamos gerenciar o enfileiramento de tasks dependentes, o que não é possível dentro da proposta do lib

### p-limit
    https://github.com/sindresorhus/p-limit
        Por que não foi testada?
            Precisamos gerenciar o enfileiramento de tasks dependentes, o que não é possível dentro da proposta do lib

### async-pool
    https://github.com/rxaviers/async-pool
        Por que não foi testada?
            Precisamos gerenciar o enfileiramento de tasks dependentes, o que não é possível dentro da proposta do lib

### es6-promise-pool:
    https://stackoverflow.com/questions/40639432/what-is-the-best-way-to-limit-concurrency-when-using-es6s-promise-all
        Por que não utilizar?
            É possível gerenciar tasks dependentes mas, devido à forma de funcionamento da lib, um pool adicional era necessário para garantir a execução de todas as tasks

### p-queue
    https://github.com/sindresorhus/p-queue
        Por que utilizar?
            Estrutura de uso simples e conseguiu atingir o número máximo de threads paralelas permitido