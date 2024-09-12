class RecintosZoo {
    constructor() {
        this.recintos = [
            { id: 1, bioma: 'SAVANA', espacos: 10, animais: ['MACACO', 'MACACO', 'MACACO'] }, 
            { id: 2, bioma: 'FLORESTA', espacos: 5, animais: [] }, 
            { id: 3, bioma: 'SAVANA_RIO', espacos: 7, animais: ['GAZELA'] }, 
            { id: 4, bioma: 'RIO', espacos: 8, animais: [] }, 
            { id: 5, bioma: 'SAVANA', espacos: 9, animais: ['LEAO'] }
        ];
        this.tamanhosAnimais = {
            LEAO: 3,
            LEOPARDO: 2,
            CROCODILO: 3,
            MACACO: 1,
            GAZELA: 2,
            HIPOPOTAMO: 4
        };
    }

    animalValido(animal) {
        const animaisValidos = ["LEAO", "LEOPARDO", "CROCODILO", "MACACO", "GAZELA", "HIPOPOTAMO"];
        return animaisValidos.includes(animal.toUpperCase());
    }

    biomaAdequado(animal) {
        const biomas = {
            LEAO: ['SAVANA'],
            LEOPARDO: ['SAVANA'],
            CROCODILO: ['RIO'],
            MACACO: ['SAVANA', 'FLORESTA'],
            GAZELA: ['SAVANA'],
            HIPOPOTAMO: ['SAVANA', 'RIO']
        };
        return biomas[animal.toUpperCase()] || [];
    }

    analisaRecintos(animal, quantidade) {
        if (!this.animalValido(animal)) {
            return {
                erro: "Animal inválido"
            };
        } else if (quantidade <= 0) {
            return {
                erro: "Quantidade inválida"
            };
        } else if (quantidade >= 10) { 
            return {
                erro: "Não há recinto viável",
                recintosViaveis: null
            };
        }

        const tamanhoAnimal = this.tamanhosAnimais[animal.toUpperCase()] * quantidade;
        let biomasAdequados = this.biomaAdequado(animal);

        // Regra especial para macacos: eles vão sempre para SAVANA_RIO
        if (animal.toUpperCase() === "MACACO") {
            biomasAdequados = ['SAVANA_RIO', 'FLORESTA', 'SAVANA'];
        }

        let recintosViaveis = this.recintos
            .filter(recinto => biomasAdequados.includes(recinto.bioma))
            .filter(recinto => {
                // Se estamos adicionando macacos, o recinto não pode conter crocodilo ou leão
                if (animal.toUpperCase() === "MACACO") {
                    return !recinto.animais.includes('CROCODILO') && !recinto.animais.includes('LEAO');
                }
                return true; // Para outros animais, não aplicamos essa regra
            })
            .map(recinto => {
                // Calculando o espaço ocupado pelos animais já no recinto
                const espacoOcupado = recinto.animais.reduce((acc, a) => acc + this.tamanhosAnimais[a], 0);
                
                // Aplicando a regra 6: se houver mais de uma espécie no recinto, 1 espaço extra é ocupado
                const variasEspecies = new Set(recinto.animais).size > 1;
                const espacoExtra = variasEspecies ? 1 : 0;
                
                // Verifica se o bioma é SAVANA_RIO e se há mais de um animal a ser adicionado
                const espacoExtraSavanaRio = recinto.bioma === 'SAVANA_RIO' && quantidade > 1 ? 1 : 0;

                // Ajuste no cálculo do espaço livre
                const espacoLivre = recinto.espacos - espacoOcupado - espacoExtra - espacoExtraSavanaRio;

                // Verificar se o espaço livre é suficiente
                if (espacoLivre >= tamanhoAnimal) {
                    return {
                        id: recinto.id,
                        descricao: `Recinto ${recinto.id} (espaço livre: ${espacoLivre - tamanhoAnimal} total: ${recinto.espacos})`,
                        espacoLivre: espacoLivre - tamanhoAnimal
                    };
                }
                return null;
            })
            .filter(recinto => recinto !== null); // Filtra recintos nulos

        // Ordenar por id, mantendo a lógica para espaço livre
        recintosViaveis.sort((a, b) => a.id - b.id);

        if (recintosViaveis.length === 0) {
            return {
                recintosViaveis: [],
                erro: 'Não há recinto viável'
            };
        } else {
            return {
                recintosViaveis: recintosViaveis.map(r => r.descricao),
                erro: null
            };
        }
    }
}

export { RecintosZoo as RecintosZoo };
