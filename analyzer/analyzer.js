console.log('AnalyzerCode загружен!');
const States = {
    S: 'S', VAR1: 'VAR1', VAR2: 'VAR2', A1: 'A1', B2: 'B2',
    C3: 'C3', D4: 'D4', H6: 'H6', I7: 'I7', J8:'J8', K9:'K9',
    AR1: 'AR1', AR2: 'AR2', AR3: 'AR3', AR4: 'AR4', L10: 'L10', M11: 'M11',
    N12: 'N12', O13: 'O13', P14: 'P14', Q15: 'Q15', R16: 'R16',
    T17: 'T17', U18: 'U18', V19: 'V19', W20: 'W20', X21: 'X21',
    Y22: 'Y22', Z23: 'Z23', A24: 'A24', B25: 'B25', C26: 'C26',
    D27: 'D27', OF1: 'OF1',G28: 'G28', H29: 'H29',
    I30: 'I30', F: 'F', E: 'E'
};

export const AnalyzerCode = (() => {
    const semantics = new Map();

    const analyzedString = (text) => {
        console.log('Начало анализа строки:', text);
        semantics.clear();
        const str = text.toLowerCase();
        let pos = 0;
        const strLen = str.length;
        let state = States.S;
        let sem = '';
        let index = 0;
        let errorText = '';
        let firstConstValue = 0;
        let secondConstValue = 0;
        let arraySem = '';

        try {
            while (pos < strLen && state !== States.E && state !== States.F) {
                let symbol = str[pos];
                switch (state) {
                    case States.S: {
                        console.log('Вошли в состояние S');
                        switch (symbol) {
                            case ' ':
                                state = States.S;
                                pos++;
                                break;
                            case 'v':
                                state = States.VAR1;
                                console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                                pos++;
                                symbol = str[pos];
                                if (symbol === 'a') {
                                    state = States.VAR2;
                                    console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                                    pos++;
                                    symbol = str[pos];
                                    if (symbol === 'r') {
                                        state = States.A1;
                                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                                        pos++;
                                        symbol = str[pos];
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = "Синтаксическая ошибка: недопустимый символ, ожидается символ 'r'";
                                    }
                                } else {
                                    state = States.E;
                                    index = pos;
                                    errorText = "Синтаксическая ошибка: недопустимый символ, ожидается символ 'a'";
                                }
                                break;
                            default:
                                state = States.E;
                                index = pos;
                                errorText = "Синтаксическая ошибка: недопустимый символ, ожидается символ ' ' или 'v'";
                                break;
                        }
                        break;
                    }
                    case States.A1: {
                        console.log('Вошли в состояние A1');
                        switch (symbol) {
                            case ' ':
                                state = States.B2;
                                console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                                pos++;
                                symbol = str[pos];
                                break;
                            default:
                                state = States.E;
                                index = pos;
                                errorText = "Синтаксическая ошибка: недопустимый символ, ожидается символ ' '";
                                break;
                        }
                        break;
                    }
                    case States.B2: {
                        arraySem = '';
                        console.log('Вошли в состояние B2');
                        switch (symbol) {
                            case ' ':
                                state = States.B2;
                                pos++;
                                break;
                            default:
                                if (symbol >= 'a' && symbol <= 'z') {
                                    sem = '' + symbol;
                                    console.log(sem);
                                    state = States.C3;
                                    console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                                    pos++;
                                    symbol = str[pos];
                                } else {
                                    state = States.E;
                                    index = pos;
                                    errorText = "Синтаксическая ошибка: недопустимый символ, ожидается символ ' ' или 'a|...|z'";
                                }
                                break;
                        }
                        break;
                    }
                    case States.C3: {
                        console.log('Вошли в состояние C3');
                        if ((symbol >= 'a' && symbol <= 'z') || (symbol >= '0' && symbol <= '9')) {
                            sem += symbol;
                            console.log(sem);
                            if (sem.length > 8) {
                                state = States.E;
                                index = pos - sem.length + 1;
                                errorText = `Семантическая ошибка: длина идентификатора '${sem}' превышает 8 символов`;
                            } else {
                                state = States.C3;
                            }
                        } else if (symbol === ',') {
                            if (['var', 'byte', 'word', 'integer', 'real', 'char', 'double', 'array'].includes(sem.toLowerCase())) {
                                state = States.E;
                                index = pos - sem.length;
                                errorText = `Семантическая ошибка: идентификатор '${sem}' не может быть зарезервированным словом`;
                            } else if (semantics.has(sem)) {
                                state = States.E;
                                index = pos - sem.length;
                                errorText = `Семантическая ошибка: идентификатор '${sem}' уже объявлен`;
                            } else {
                                semantics.set(sem, null);
                                sem = '';
                                state = States.B2;
                            }
                        } else if (symbol === ':') {
                            if (['var', 'byte', 'word', 'integer', 'real', 'char', 'double', 'array'].includes(sem.toLowerCase())) {
                                state = States.E;
                                index = pos - sem.length;
                                errorText = `Семантическая ошибка: идентификатор '${sem}' не может быть зарезервированным словом`;
                            } else if (semantics.has(sem)) {
                                state = States.E;
                                index = pos - sem.length;
                                errorText = `Семантическая ошибка: идентификатор '${sem}' уже объявлен`;
                            } else {
                                semantics.set(sem, null);
                                sem = '';
                                state = States.D4;
                            }
                        } else if (symbol === ' ') {
                            if (['var', 'byte', 'word', 'integer', 'real', 'char', 'double', 'array'].includes(sem.toLowerCase())) {
                                state = States.E;
                                index = pos - sem.length;
                                errorText = `Семантическая ошибка: идентификатор '${sem}' не может быть зарезервированным словом`;
                            } else if (semantics.has(sem)) {
                                state = States.E;
                                index = pos - sem.length;
                                errorText = `Семантическая ошибка: идентификатор '${sem}' уже объявлен`;
                            } else {
                                semantics.set(sem, null);
                                sem = '';
                                state = States.K9;
                            }
                        } else {
                            state = States.E;
                            index = pos;
                            errorText = `Синтаксическая ошибка: недопустимый символ '${symbol}' в идентификаторе`;
                        }
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        pos++;
                        symbol = str[pos];
                        break;
                    }
                    case States.K9: {
                        console.log('Вошли в состояние K9');
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        switch (symbol) {
                            case ' ': {
                                state = States.K9;
                                break;
                            }
                            case ',': {
                                state = States.B2;
                                break;
                            }
                            case ':': {
                                state = States.D4;
                                break;
                            }
                            default: {
                                state = States.E;
                                index = pos;
                                errorText = "Синтаксическая ошибка: недопустимый символ, ожидается символ ' ', ',' или ':'";
                                break;
                            }
                        }
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        pos++;
                        break;
                    }
                    case States.D4: {
                        console.log('Вошли в состояние D4');
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        if (symbol === 'a'){
                            state = States.AR1;
                            pos++;
                            symbol = str[pos];
                            break;
                        }
                        if (symbol === ' ') {
                            state = States.H6;
                            pos++;
                            symbol = str[pos];
                        } else {
                            switch (symbol) {
                                case 'b': {
                                    pos++
                                    symbol = str[pos];
                                    console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                                    if (symbol === 'y') {
                                        pos++
                                        symbol = str[pos];
                                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                                        if (symbol === 't') {
                                            pos++
                                            symbol = str[pos];
                                            console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                                            if (symbol === 'e') {
                                                for (const id of semantics.keys()) {
                                                    if (semantics.get(id) === null) {
                                                        semantics.set(id, 'byte'); // Сохраняем 'byte' в map
                                                    }
                                                }
                                                state = States.I7;
                                                pos++
                                                symbol = str[pos];
                                                console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                                                break;
                                            } else {
                                                state = States.E;
                                                index = pos;
                                                errorText = `Синтаксическая ошибка: ожидается 'e' для завершения слова 'byte', найден '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Синтаксическая ошибка: ожидается 't' для завершения слова 'byte', найден '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Синтаксическая ошибка: ожидается 'y' для завершения слова 'byte', найден '${symbol}'`;
                                    }
                                    break;
                                }
                                case 'w': { // Для слова 'word'
                                    pos++;
                                    symbol = str[pos];
                                    if (symbol === 'o') {
                                        pos++;
                                        symbol = str[pos];
                                        if (symbol === 'r') {
                                            pos++;
                                            symbol = str[pos];
                                            if (symbol === 'd') {
                                                // Сохраняем 'word' в map
                                                for (const id of semantics.keys()) {
                                                    if (semantics.get(id) === null) {
                                                        semantics.set(id, 'word');
                                                    }
                                                }
                                                state = States.I7;
                                                pos++;
                                                symbol = str[pos];
                                                break;
                                            } else {
                                                state = States.E;
                                                index = pos;
                                                errorText = `Синтаксическая ошибка: ожидается 'd' для завершения слова 'word', найден '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Синтаксическая ошибка: ожидается 'r' для завершения слова 'word', найден '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Синтаксическая ошибка: ожидается 'o' для завершения слова 'word', найден '${symbol}'`;
                                    }
                                    break;
                                }
                                case 'i': { // Для слова 'integer'
                                    pos++;
                                    symbol = str[pos];
                                    if (symbol === 'n') {
                                        pos++;
                                        symbol = str[pos];
                                        if (symbol === 't') {
                                            pos++;
                                            symbol = str[pos];
                                            if (symbol === 'e') {
                                                pos++;
                                                symbol = str[pos];
                                                if (symbol === 'g') {
                                                    pos++;
                                                    symbol = str[pos];
                                                    if (symbol === 'e') {
                                                        pos++;
                                                        symbol = str[pos];
                                                        if (symbol === 'r') {
                                                            // Сохраняем 'integer' в map
                                                            for (const id of semantics.keys()) {
                                                                if (semantics.get(id) === null) {
                                                                    semantics.set(id, 'integer');
                                                                }
                                                            }
                                                            state = States.I7;
                                                            pos++;
                                                            symbol = str[pos];
                                                            break;
                                                        } else {
                                                            state = States.E;
                                                            index = pos;
                                                            errorText = `Синтаксическая ошибка: ожидается 'r' для завершения слова 'integer', найден '${symbol}'`;
                                                        }
                                                    } else {
                                                        state = States.E;
                                                        index = pos;
                                                        errorText = `Синтаксическая ошибка: ожидается 'r' для завершения слова 'integer', найден '${symbol}'`;
                                                    }
                                                } else {
                                                    state = States.E;
                                                    index = pos;
                                                    errorText = `Синтаксическая ошибка: ожидается 'g' для завершения слова 'integer', найден '${symbol}'`;
                                                }
                                            } else {
                                                state = States.E;
                                                index = pos;
                                                errorText = `Синтаксическая ошибка: ожидается 'e' для завершения слова 'integer', найден '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Синтаксическая ошибка: ожидается 't' для завершения слова 'integer', найден '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Синтаксическая ошибка: ожидается 'n' для завершения слова 'integer', найден '${symbol}'`;
                                    }
                                    break;
                                }
                                case 'r': { // Для слова 'real'
                                    pos++;
                                    symbol = str[pos];
                                    if (symbol === 'e') {
                                        pos++;
                                        symbol = str[pos];
                                        if (symbol === 'a') {
                                            pos++;
                                            symbol = str[pos];
                                            if (symbol === 'l') {
                                                // Сохраняем 'real' в map
                                                for (const id of semantics.keys()) {
                                                    if (semantics.get(id) === null) {
                                                        semantics.set(id, 'real');
                                                    }
                                                }
                                                state = States.I7;
                                                pos++;
                                                symbol = str[pos];
                                                break;
                                            } else {
                                                state = States.E;
                                                index = pos;
                                                errorText = `Синтаксическая ошибка: ожидается 'l' для завершения слова 'real', найден '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Синтаксическая ошибка: ожидается 'a' для завершения слова 'real', найден '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Синтаксическая ошибка: ожидается 'e' для завершения слова 'real', найден '${symbol}'`;
                                    }
                                    break;
                                }
                                case 'c': { // Для слова 'char'
                                    pos++;
                                    symbol = str[pos];
                                    if (symbol === 'h') {
                                        pos++;
                                        symbol = str[pos];
                                        if (symbol === 'a') {
                                            pos++;
                                            symbol = str[pos];
                                            if (symbol === 'r') {
                                                // Сохраняем 'char' в map
                                                for (const id of semantics.keys()) {
                                                    if (semantics.get(id) === null) {
                                                        semantics.set(id, 'char');
                                                    }
                                                }
                                                state = States.I7;
                                                pos++;
                                                symbol = str[pos];
                                                break;
                                            } else {
                                                state = States.E;
                                                index = pos;
                                                errorText = `Синтаксическая ошибка: ожидается 'r' для завершения слова 'char', найден '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Синтаксическая ошибка: ожидается 'a' для завершения слова 'char', найден '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Синтаксическая ошибка: ожидается 'h' для завершения слова 'char', найден '${symbol}'`;
                                    }
                                    break;
                                }
                                case 'd': {
                                    pos++;
                                    symbol = str[pos];
                                    if (symbol === 'o') {
                                        pos++;
                                        symbol = str[pos];
                                        if (symbol === 'u') {
                                            pos++;
                                            symbol = str[pos];
                                            if (symbol === 'b') {
                                                pos++;
                                                symbol = str[pos];
                                                if (symbol === 'l') {
                                                    pos++;
                                                    symbol = str[pos];
                                                    if (symbol === 'e') {
                                                        for (const id of semantics.keys()) {
                                                            if (semantics.get(id) === null) {
                                                                semantics.set(id, 'double');
                                                            }
                                                        }
                                                        state = States.I7;
                                                        pos++;
                                                        symbol = str[pos];
                                                        break;
                                                    } else {
                                                        state = States.E;
                                                        index = pos;
                                                        errorText = `Синтаксическая ошибка: ожидается 'e' для завершения слова 'double', найден '${symbol}'`;
                                                    }
                                                } else {
                                                    state = States.E;
                                                    index = pos;
                                                    errorText = `Синтаксическая ошибка: ожидается 'l' для завершения слова 'double', найден '${symbol}'`;
                                                }
                                            } else {
                                                state = States.E;
                                                index = pos;
                                                errorText = `Синтаксическая ошибка: ожидается 'b' для завершения слова 'double', найден '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Синтаксическая ошибка: ожидается 'u' для завершения слова 'double', найден '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Синтаксическая ошибка: ожидается 'o' для завершения слова 'double', найден '${symbol}'`;
                                    }
                                    break;
                                }
                                default: {
                                    state = States.E;
                                    index = pos;
                                    errorText = `Синтаксическая ошибка: найден некорректный символ '${symbol}', ожидается один из символов 'b', 'w', 'i', 'r', 'c', 'd'`;
                                    break;
                                }
                            }
                        }
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        break;
                    }
                    case States.H6: {
                        if (symbol === 'a'){
                            state = States.AR1;
                            pos++;
                            symbol = str[pos];
                            break;
                        }
                        if (symbol === ' ') {
                            state = States.H6;
                            pos++;
                            symbol = str[pos];
                        } else {
                            switch (symbol) {
                                case 'b': {
                                    pos++
                                    symbol = str[pos];
                                    console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                                    if (symbol === 'y') {
                                        pos++
                                        symbol = str[pos];
                                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                                        if (symbol === 't') {
                                            pos++
                                            symbol = str[pos];
                                            console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                                            if (symbol === 'e') {
                                                for (const id of semantics.keys()) {
                                                    if (semantics.get(id) === null) {
                                                        semantics.set(id, 'byte'); // Сохраняем 'byte' в map
                                                    }
                                                }
                                                state = States.I7;
                                                pos++
                                                symbol = str[pos];
                                                console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                                                break;
                                            } else {
                                                state = States.E;
                                                index = pos;
                                                errorText = `Синтаксическая ошибка: ожидается 'e' для завершения слова 'byte', найден '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Синтаксическая ошибка: ожидается 't' для завершения слова 'byte', найден '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Синтаксическая ошибка: ожидается 'y' для завершения слова 'byte', найден '${symbol}'`;
                                    }
                                    break;
                                }
                                case 'w': { // Для слова 'word'
                                    pos++;
                                    symbol = str[pos];
                                    if (symbol === 'o') {
                                        pos++;
                                        symbol = str[pos];
                                        if (symbol === 'r') {
                                            pos++;
                                            symbol = str[pos];
                                            if (symbol === 'd') {
                                                // Сохраняем 'word' в map
                                                for (const id of semantics.keys()) {
                                                    if (semantics.get(id) === null) {
                                                        semantics.set(id, 'word');
                                                    }
                                                }
                                                state = States.I7;
                                                pos++;
                                                symbol = str[pos];
                                                break;
                                            } else {
                                                state = States.E;
                                                index = pos;
                                                errorText = `Синтаксическая ошибка: ожидается 'd' для завершения слова 'word', найден '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Синтаксическая ошибка: ожидается 'r' для завершения слова 'word', найден '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Синтаксическая ошибка: ожидается 'o' для завершения слова 'word', найден '${symbol}'`;
                                    }
                                    break;
                                }
                                case 'i': { // Для слова 'integer'
                                    pos++;
                                    symbol = str[pos];
                                    if (symbol === 'n') {
                                        pos++;
                                        symbol = str[pos];
                                        if (symbol === 't') {
                                            pos++;
                                            symbol = str[pos];
                                            if (symbol === 'e') {
                                                pos++;
                                                symbol = str[pos];
                                                if (symbol === 'g') {
                                                    pos++;
                                                    symbol = str[pos];
                                                    if (symbol === 'e') {
                                                        pos++;
                                                        symbol = str[pos];
                                                        if (symbol === 'r') {
                                                            // Сохраняем 'integer' в map
                                                            for (const id of semantics.keys()) {
                                                                if (semantics.get(id) === null) {
                                                                    semantics.set(id, 'integer');
                                                                }
                                                            }
                                                            state = States.I7;
                                                            pos++;
                                                            symbol = str[pos];
                                                            break;
                                                        } else {
                                                            state = States.E;
                                                            index = pos;
                                                            errorText = `Синтаксическая ошибка: ожидается 'r' для завершения слова 'integer', найден '${symbol}'`;
                                                        }
                                                    } else {
                                                        state = States.E;
                                                        index = pos;
                                                        errorText = `Синтаксическая ошибка: ожидается 'r' для завершения слова 'integer', найден '${symbol}'`;
                                                    }
                                                } else {
                                                    state = States.E;
                                                    index = pos;
                                                    errorText = `Синтаксическая ошибка: ожидается 'g' для завершения слова 'integer', найден '${symbol}'`;
                                                }
                                            } else {
                                                state = States.E;
                                                index = pos;
                                                errorText = `Синтаксическая ошибка: ожидается 'e' для завершения слова 'integer', найден '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Синтаксическая ошибка: ожидается 't' для завершения слова 'integer', найден '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Синтаксическая ошибка: ожидается 'n' для завершения слова 'integer', найден '${symbol}'`;
                                    }
                                    break;
                                }
                                case 'r': { // Для слова 'real'
                                    pos++;
                                    symbol = str[pos];
                                    if (symbol === 'e') {
                                        pos++;
                                        symbol = str[pos];
                                        if (symbol === 'a') {
                                            pos++;
                                            symbol = str[pos];
                                            if (symbol === 'l') {
                                                // Сохраняем 'real' в map
                                                for (const id of semantics.keys()) {
                                                    if (semantics.get(id) === null) {
                                                        semantics.set(id, 'real');
                                                    }
                                                }
                                                state = States.I7;
                                                pos++;
                                                symbol = str[pos];
                                                break;
                                            } else {
                                                state = States.E;
                                                index = pos;
                                                errorText = `Синтаксическая ошибка: ожидается 'l' для завершения слова 'real', найден '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Синтаксическая ошибка: ожидается 'a' для завершения слова 'real', найден '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Синтаксическая ошибка: ожидается 'e' для завершения слова 'real', найден '${symbol}'`;
                                    }
                                    break;
                                }
                                case 'c': { // Для слова 'char'
                                    pos++;
                                    symbol = str[pos];
                                    if (symbol === 'h') {
                                        pos++;
                                        symbol = str[pos];
                                        if (symbol === 'a') {
                                            pos++;
                                            symbol = str[pos];
                                            if (symbol === 'r') {
                                                // Сохраняем 'char' в map
                                                for (const id of semantics.keys()) {
                                                    if (semantics.get(id) === null) {
                                                        semantics.set(id, 'char');
                                                    }
                                                }
                                                state = States.I7;
                                                pos++;
                                                symbol = str[pos];
                                                break;
                                            } else {
                                                state = States.E;
                                                index = pos;
                                                errorText = `Синтаксическая ошибка: ожидается 'r' для завершения слова 'char', найден '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Синтаксическая ошибка: ожидается 'a' для завершения слова 'char', найден '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Синтаксическая ошибка: ожидается 'h' для завершения слова 'char', найден '${symbol}'`;
                                    }
                                    break;
                                }
                                case 'd': {
                                    pos++;
                                    symbol = str[pos];
                                    if (symbol === 'o') {
                                        pos++;
                                        symbol = str[pos];
                                        if (symbol === 'u') {
                                            pos++;
                                            symbol = str[pos];
                                            if (symbol === 'b') {
                                                pos++;
                                                symbol = str[pos];
                                                if (symbol === 'l') {
                                                    pos++;
                                                    symbol = str[pos];
                                                    if (symbol === 'e') {
                                                        for (const id of semantics.keys()) {
                                                            if (semantics.get(id) === null) {
                                                                semantics.set(id, 'double');
                                                            }
                                                        }
                                                        state = States.I7;
                                                        pos++;
                                                        symbol = str[pos];
                                                        break;
                                                    } else {
                                                        state = States.E;
                                                        index = pos;
                                                        errorText = `Синтаксическая ошибка: ожидается 'e' для завершения слова 'double', найден '${symbol}'`;
                                                    }
                                                } else {
                                                    state = States.E;
                                                    index = pos;
                                                    errorText = `Синтаксическая ошибка: ожидается 'l' для завершения слова 'double', найден '${symbol}'`;
                                                }
                                            } else {
                                                state = States.E;
                                                index = pos;
                                                errorText = `Синтаксическая ошибка: ожидается 'b' для завершения слова 'double', найден '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Синтаксическая ошибка: ожидается 'u' для завершения слова 'double', найден '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Синтаксическая ошибка: ожидается 'o' для завершения слова 'double', найден '${symbol}'`;
                                    }
                                    break;
                                }
                                default: {
                                    state = States.E;
                                    index = pos;
                                    errorText = `Синтаксическая ошибка: найден некорректный символ '${symbol}', ожидается один из символов 'b', 'w', 'i', 'r', 'c', 'd'`;
                                    break;
                                }
                            }
                        }
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        break;
                    }
                    case States.I7: {
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        switch (symbol) {
                            case ' ': {
                                state = States.I7;
                                break;
                            }
                            case ',': {
                                state = States.B2;
                                break;
                            }
                            case ';': {
                                state = States.F;
                                break;
                            }
                            default: {
                                state = States.E;
                                index = pos;
                                errorText = `Синтаксическая ошибка: недопустимый символ '${symbol}', ожидается  ' ', ',' или ';'`;
                            }
                        }
                        pos++;
                        break;
                    }
                    case States.AR1:{
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        switch (symbol) {
                           case 'r':{
                               state = States.AR2;
                               break;
                           }
                           default: {
                               state = States.E;
                               index = pos;
                               errorText = `Синтаксическая ошибка: недопустимый символ '${symbol}', ожидается  'r'`;
                               break;
                           }
                        }
                        pos++;
                        break;
                    }
                    case States.AR2:{
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        switch (symbol) {
                            case 'r':{
                                state = States.AR3;
                                break;
                            }
                            default: {
                                state = States.E;
                                index = pos;
                                errorText = `Синтаксическая ошибка: недопустимый символ '${symbol}', ожидается  'r'`;
                                break;
                            }
                        }
                        pos++;
                        break;
                    }
                    case States.AR3:{
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        switch (symbol) {
                            case 'a':{
                                state = States.AR4;
                                break;
                            }
                            default: {
                                state = States.E;
                                index = pos;
                                errorText = `Синтаксическая ошибка: недопустимый символ '${symbol}', ожидается  'a'`;
                                break;
                            }
                        }
                        pos++;
                        break;
                    }
                    case States.AR4:{
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        switch (symbol) {
                            case 'y':{
                                state = States.J8;
                                break;
                            }
                            default: {
                                state = States.E;
                                index = pos;
                                errorText = `Синтаксическая ошибка: недопустимый символ '${symbol}', ожидается  'y'`;
                                break;
                            }
                        }
                        pos++;
                        break;
                    }
                    case States.J8:{
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        switch (symbol) {
                            case ' ':{
                                state = States.J8;
                                break;
                            }
                            case '[':{
                                state = States.L10;
                                break;
                            }
                            default: {
                                state = States.E;
                                index = pos;
                                errorText = `Синтаксическая ошибка: недопустимый символ '${symbol}', ожидается  ' ' или '['`;
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.L10:{
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        switch (symbol) {
                            case ' ':{
                                state = States.L10;
                                break;
                            }
                            case '+':case'-':{
                                sem = '' + symbol;
                                state = States.M11;
                                break;
                            }
                            default: {
                                if (symbol >= '0' && symbol <= '9') {
                                    sem = '' + symbol;
                                    state = States.N12;
                                }else{
                                    state = States.E;
                                    index = pos;
                                    errorText = `Синтаксическая ошибка: недопустимый символ '${symbol}', ожидается  '0|...|9 ', '+', '-' или ' '`;
                                }
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.M11:{
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        switch (symbol) {
                            default: {
                                if (symbol >= '0' && symbol <= '9') {
                                    sem += symbol;
                                    state = States.N12;
                                }else{
                                    state = States.E;
                                    index = pos;
                                    errorText = `Синтаксическая ошибка: недопустимый символ '${symbol}', ожидается  '0|...|9'`;
                                }
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.N12:{
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        switch (symbol) {
                            case ' ':{
                                if (checkRange(sem)) {
                                    firstConstValue = parseInt(sem, 10);
                                    state = States.P14;
                                } else {
                                    state = States.E;
                                    index = pos - sem.length;
                                    errorText = `Семантическая ошибка: значение '${sem}' выходит за допустимый диапазон [-32768, 32767]`;
                                }
                                sem = "";
                                break;
                            }
                            case ':':{
                                if (checkRange(sem)) {
                                    firstConstValue = parseInt(sem, 10);
                                    state = States.O13;
                                } else {
                                    state = States.E;
                                    index = pos- sem.length;
                                    errorText = `Семантическая ошибка: значение '${sem}' выходит за допустимый диапазон [-32768, 32767]`;
                                }
                                sem = '';
                                break;
                            }
                            default: {
                                if (symbol >= '0' && symbol <= '9') {
                                    sem += symbol;
                                    state = States.N12;
                                }else{
                                    state = States.E;
                                    index = pos;
                                    errorText = `Синтаксическая ошибка: недопустимый символ '${symbol}', ожидается  '0|...|9', ':' или ' '`;
                                }
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.P14:{
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        switch (symbol) {
                            case ' ':{
                                state = States.P14;
                                break;
                            }
                            case ':':{
                                state = States.O13;
                                break;
                            }
                            default: {
                                state = States.E;
                                index = pos;
                                errorText = `Синтаксическая ошибка: недопустимый символ '${symbol}', ожидается ':' или ' '`;
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.O13:{
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        switch (symbol) {
                            case ' ':{
                                state = States.O13;
                                break;
                            }
                            case '+':case'-':{
                                sem = '' + symbol;
                                state = States.Q15;
                                break;
                            }
                            default: {
                                if (symbol >= '0' && symbol <= '9') {
                                    sem = '' + symbol;
                                    state = States.R16;
                                }else{
                                    state = States.E;
                                    index = pos;
                                    errorText = `Синтаксическая ошибка: недопустимый символ '${symbol}', ожидается  '0|...|9 ', '+', '-' или ' '`;
                                }
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.Q15:{
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        switch (symbol) {
                            default: {
                                if (symbol >= '0' && symbol <= '9') {
                                    sem += symbol;
                                    state = States.R16;
                                }else{
                                    state = States.E;
                                    index = pos;
                                    errorText = `Синтаксическая ошибка: недопустимый символ '${symbol}', ожидается  '0|...|9'`;
                                }
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.R16:{
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        switch (symbol) {
                            case ' ':{
                                if (checkRange(sem)) {
                                    secondConstValue = parseInt(sem, 10);
                                    console.log(`1 const = "${firstConstValue}", 2 const = "${secondConstValue}"`)
                                    if (secondConstValue <= firstConstValue){
                                        state = States.E;
                                        index = pos - secondConstValue.toString().length;
                                        errorText = `Семантическая ошибка: значение константы 2 '${secondConstValue}' должно быть больше, чем значение константы 1 '${firstConstValue}'`;
                                    }else{
                                        state = States.W20;
                                    }
                                } else {
                                    state = States.E;
                                    index = pos-sem.length;
                                    errorText = `Семантическая ошибка: значение '${sem}' выходит за допустимый диапазон [-32768, 32767]`;
                                }
                                sem = '';
                                break;
                            }
                            case ']':{
                                if (checkRange(sem)) {
                                    secondConstValue = parseInt(sem, 10);
                                    console.log(`1 const = "${firstConstValue}", 2 const = "${secondConstValue}"`)
                                    if (secondConstValue <= firstConstValue){
                                        state = States.E;
                                        index = pos - secondConstValue.toString().length;
                                        errorText = `Семантическая ошибка: значение константы 2 '${secondConstValue}' должно быть больше, чем значение константы 1 '${firstConstValue}'`;
                                    }else{
                                        state = States.C26;
                                    }
                                } else {
                                    state = States.E;
                                    index = pos-sem.length;
                                    errorText = `Семантическая ошибка: значение '${sem}' выходит за допустимый диапазон [-32768, 32767]`;
                                }
                                sem = '';
                                arraySem = `${firstConstValue}:${secondConstValue}`;
                                console.log(arraySem);
                                firstConstValue = 0;
                                secondConstValue = 0;
                                break;
                            }
                            case ',':{
                                if (checkRange(sem)) {
                                    secondConstValue = parseInt(sem, 10);
                                    console.log(`1 const = "${firstConstValue}", 2 const = "${secondConstValue}"`)
                                    if (secondConstValue <= firstConstValue){
                                        state = States.E;
                                        index = pos - secondConstValue.toString().length;
                                        errorText = `Семантическая ошибка: значение константы 2 '${secondConstValue}' должно быть больше, чем значение константы 1 '${firstConstValue}'`;
                                    }else{
                                        state = States.T17;
                                    }
                                } else {
                                    state = States.E;
                                    index = pos-sem.length;
                                    errorText = `Семантическая ошибка: значение '${sem}' выходит за допустимый диапазон [-32768, 32767]`;
                                }
                                sem = '';
                                arraySem = `${firstConstValue}:${secondConstValue}`;
                                console.log(arraySem);
                                firstConstValue = 0;
                                secondConstValue = 0;
                                break;
                            }
                            default: {
                                if (symbol >= '0' && symbol <= '9') {
                                    sem += symbol;
                                    state = States.R16;
                                }else{
                                    state = States.E;
                                    index = pos;
                                    errorText = `Синтаксическая ошибка: недопустимый символ '${symbol}', ожидается  '0|...|9', ',',' ' или ']'`;
                                }
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.W20:{
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        switch (symbol) {
                            case ' ':{
                                state = States.W20;
                                break;
                            }
                            case ',':{
                                sem = '';
                                arraySem = `${firstConstValue}:${secondConstValue}`;
                                console.log(arraySem);
                                firstConstValue = 0;
                                secondConstValue = 0;
                                state = States.T17;
                                break;
                            }
                            case ']':{
                                sem = '';
                                arraySem = `${firstConstValue}:${secondConstValue}`;
                                console.log(arraySem);
                                firstConstValue = 0;
                                secondConstValue = 0;
                                state = States.C26;
                                break;
                            }
                            default: {
                                state = States.E;
                                index = pos;
                                errorText = `Синтаксическая ошибка: недопустимый символ '${symbol}', ожидается ',', ']' или ' '`;
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.T17:{
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        switch (symbol) {
                            case ' ':{
                                state = States.T17;
                                break;
                            }
                            case '+':case'-':{
                                sem = ''+ symbol;
                                state = States.U18;
                                break;
                            }
                            default: {
                                if (symbol >= '0' && symbol <= '9') {
                                    sem = ''+ symbol;
                                    state = States.V19;
                                }else{
                                    state = States.E;
                                    index = pos;
                                    errorText = `Синтаксическая ошибка: недопустимый символ '${symbol}', ожидается  '0|...|9 ', '+', '-' или ' '`;
                                }
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.U18:{
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        switch (symbol) {
                            default: {
                                if (symbol >= '0' && symbol <= '9') {
                                    sem += symbol;
                                    state = States.V19;
                                }else{
                                    state = States.E;
                                    index = pos;
                                    errorText = `Синтаксическая ошибка: недопустимый символ '${symbol}', ожидается  '0|...|9'`;
                                }
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.V19:{
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        switch (symbol) {
                            case ' ':{
                                if (checkRange(sem)) {
                                    firstConstValue = parseInt(sem,10);
                                    state = States.Y22;
                                } else {
                                    state = States.E;
                                    index = pos-sem.length;
                                    errorText = `Семантическая ошибка: значение '${sem}' выходит за допустимый диапазон [-32768, 32767]`;
                                }
                                sem = '';
                                break;
                            }
                            case ':':{
                                if (checkRange(sem)) {
                                    firstConstValue = parseInt(sem,10);
                                    state = States.X21;
                                } else {
                                    state = States.E;
                                    index = pos-sem.length;
                                    errorText = `Семантическая ошибка: значение '${sem}' выходит за допустимый диапазон [-32768, 32767]`;
                                }
                                sem = '';
                                break;
                            }
                            default: {
                                if (symbol >= '0' && symbol <= '9') {
                                    sem += symbol;
                                    state = States.V19;
                                }else{
                                    state = States.E;
                                    index = pos;
                                    errorText = `Синтаксическая ошибка: недопустимый символ '${symbol}', ожидается  '0|...|9', ':' или ' '`;
                                }
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.Y22:{
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        switch (symbol) {
                            case ' ':{
                                state = States.Y22;
                                break;
                            }
                            case ':':{
                                state = States.X21;
                                break;
                            }
                            default: {
                                state = States.E;
                                index = pos;
                                errorText = `Синтаксическая ошибка: недопустимый символ '${symbol}', ожидается ':' или ' '`;
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.X21:{
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        switch (symbol) {
                            case ' ':{
                                state = States.X21;
                                break;
                            }
                            case '+':case'-':{
                                sem = ''+ symbol;
                                state = States.Z23;
                                break;
                            }
                            default: {
                                if (symbol >= '0' && symbol <= '9') {
                                    sem = ''+ symbol;
                                    state = States.A24;
                                }else{
                                    state = States.E;
                                    index = pos;
                                    errorText = `Синтаксическая ошибка: недопустимый символ '${symbol}', ожидается  '0|...|9 ', '+', '-' или ' '`;
                                }
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.Z23:{
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        switch (symbol) {
                            default: {
                                if (symbol >= '0' && symbol <= '9') {
                                    sem += symbol;
                                    state = States.A24;
                                }else{
                                    state = States.E;
                                    index = pos;
                                    errorText = `Синтаксическая ошибка: недопустимый символ '${symbol}', ожидается  '0|...|9'`;
                                }
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.A24:{
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        switch (symbol) {
                            case ' ':{
                                if (checkRange(sem)) {
                                    secondConstValue = parseInt(sem, 10);
                                    console.log(`1 const = "${firstConstValue}", 2 const = "${secondConstValue}"`)
                                    if (secondConstValue <= firstConstValue){
                                        state = States.E;
                                        index = pos - secondConstValue.toString().length;
                                        errorText = `Семантическая ошибка: значение константы 2 '${secondConstValue}' должно быть больше, чем значение константы 1 '${firstConstValue}'`;
                                    }else{
                                        state = States.B25;
                                    }
                                } else {
                                    state = States.E;
                                    index = pos-sem.length;
                                    errorText = `Семантическая ошибка: значение '${sem}' выходит за допустимый диапазон [-32768, 32767]`;
                                }
                                sem = '';
                                break;
                            }
                            case ']':{
                                if (checkRange(sem)) {
                                    secondConstValue = parseInt(sem, 10);
                                    console.log(`1 const = "${firstConstValue}", 2 const = "${secondConstValue}"`)
                                    if (secondConstValue <= firstConstValue){
                                        state = States.E;
                                        index = pos - secondConstValue.toString().length;
                                        errorText = `Семантическая ошибка: значение константы 2 '${secondConstValue}' должно быть больше, чем значение константы 1 '${firstConstValue}'`;
                                    }else{
                                        state = States.C26;
                                    }
                                } else {
                                    state = States.E;
                                    index = pos-sem.length;
                                    errorText = `Семантическая ошибка: значение '${sem}' выходит за допустимый диапазон [-32768, 32767]`;
                                }
                                sem = '';
                                arraySem += `,${firstConstValue}:${secondConstValue}`;
                                console.log(arraySem);
                                firstConstValue = 0;
                                secondConstValue = 0;
                                break;
                            }
                            default: {
                                if (symbol >= '0' && symbol <= '9') {
                                    sem += symbol;
                                    state = States.A24;
                                }else{
                                    state = States.E;
                                    index = pos;
                                    errorText = `Синтаксическая ошибка: недопустимый символ '${symbol}', ожидается  '0|...|9', ']' или ' '`;
                                }
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.B25:{
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        switch (symbol) {
                            case ' ':{
                                state = States.B25;
                                break;
                            }
                            case ']':{
                                sem = '';
                                arraySem += `,${firstConstValue}:${secondConstValue}`;
                                console.log(arraySem);
                                firstConstValue = 0;
                                secondConstValue = 0;
                                state = States.C26;
                                break;
                            }
                            default: {
                                state = States.E;
                                index = pos;
                                errorText = `Синтаксическая ошибка: недопустимый символ '${symbol}', ожидается ']' или ' '`;
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.C26:{
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        switch (symbol) {
                            case ' ':{
                                state = States.D27;
                                break;
                            }
                            default: {
                                state = States.E;
                                index = pos;
                                errorText = `Синтаксическая ошибка: недопустимый символ '${symbol}', ожидается ' '`;
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.D27:{
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        switch (symbol) {
                            case ' ':{
                                state = States.D27;
                                break;
                            }
                            case 'o':{
                                state = States.OF1;
                                break;
                            }
                            default: {
                                state = States.E;
                                index = pos;
                                errorText = `Синтаксическая ошибка: недопустимый символ '${symbol}', ожидается 'o' или ' '`;
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.OF1:{
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        switch (symbol) {
                            case 'f':{
                                state = States.G28;
                                break;
                            }
                            default: {
                                state = States.E;
                                index = pos;
                                errorText = `Синтаксическая ошибка: недопустимый символ '${symbol}', ожидается 'f'`;
                                break;
                            }
                        }
                        pos++;
                        break;
                    }
                    case States.G28: {
                        console.log('Вошли в состояние G28');
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        if (symbol === ' ') {
                            state = States.H29;
                            pos++;
                            symbol = str[pos];
                        }else {
                            state = States.E;
                            index = pos;
                            errorText = `Синтаксическая ошибка: ожидается ' ', найден '${symbol}'`;
                        }
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        break;
                    }
                    case States.H29: {
                        console.log('Вошли в состояние G28');
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        if (symbol === ' ') {
                            state = States.H29;
                            pos++;
                            symbol = str[pos];
                        } else {
                            switch (symbol) {
                                case 'b': {
                                    pos++
                                    symbol = str[pos];
                                    console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                                    if (symbol === 'y') {
                                        pos++
                                        symbol = str[pos];
                                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                                        if (symbol === 't') {
                                            pos++
                                            symbol = str[pos];
                                            console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                                            if (symbol === 'e') {
                                                for (const id of semantics.keys()) {
                                                    if (semantics.get(id) === null) {
                                                        semantics.set(id, `array[${arraySem}] of byte`); // Сохраняем 'byte' в map
                                                    }
                                                }
                                                state = States.I30;
                                                pos++
                                                symbol = str[pos];
                                                console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                                                break;
                                            } else {
                                                state = States.E;
                                                index = pos;
                                                errorText = `Синтаксическая ошибка: ожидается 'e' для завершения слова 'byte', найден '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Синтаксическая ошибка: ожидается 't' для завершения слова 'byte', найден '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Синтаксическая ошибка: ожидается 'y' для завершения слова 'byte', найден '${symbol}'`;
                                    }
                                    break;
                                }
                                case 'w': { // Для слова 'word'
                                    pos++;
                                    symbol = str[pos];
                                    if (symbol === 'o') {
                                        pos++;
                                        symbol = str[pos];
                                        if (symbol === 'r') {
                                            pos++;
                                            symbol = str[pos];
                                            if (symbol === 'd') {
                                                // Сохраняем 'word' в map
                                                for (const id of semantics.keys()) {
                                                    if (semantics.get(id) === null) {
                                                        semantics.set(id, `array[${arraySem}] of word`);
                                                    }
                                                }
                                                state = States.I30;
                                                pos++;
                                                symbol = str[pos];
                                                break;
                                            } else {
                                                state = States.E;
                                                index = pos;
                                                errorText = `Синтаксическая ошибка: ожидается 'd' для завершения слова 'word', найден '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Синтаксическая ошибка: ожидается 'r' для завершения слова 'word', найден '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Синтаксическая ошибка: ожидается 'o' для завершения слова 'word', найден '${symbol}'`;
                                    }
                                    break;
                                }
                                case 'i': { // Для слова 'integer'
                                    pos++;
                                    symbol = str[pos];
                                    if (symbol === 'n') {
                                        pos++;
                                        symbol = str[pos];
                                        if (symbol === 't') {
                                            pos++;
                                            symbol = str[pos];
                                            if (symbol === 'e') {
                                                pos++;
                                                symbol = str[pos];
                                                if (symbol === 'g') {
                                                    pos++;
                                                    symbol = str[pos];
                                                    if (symbol === 'e') {
                                                        pos++;
                                                        symbol = str[pos];
                                                        if (symbol === 'r') {
                                                            // Сохраняем 'integer' в map
                                                            for (const id of semantics.keys()) {
                                                                if (semantics.get(id) === null) {
                                                                    semantics.set(id, `array[${arraySem}] of integer`);
                                                                }
                                                            }
                                                            state = States.I30;
                                                            pos++;
                                                            symbol = str[pos];
                                                            break;
                                                        } else {
                                                            state = States.E;
                                                            index = pos;
                                                            errorText = `Синтаксическая ошибка: ожидается 'r' для завершения слова 'integer', найден '${symbol}'`;
                                                        }
                                                    } else {
                                                        state = States.E;
                                                        index = pos;
                                                        errorText = `Синтаксическая ошибка: ожидается 'r' для завершения слова 'integer', найден '${symbol}'`;
                                                    }
                                                } else {
                                                    state = States.E;
                                                    index = pos;
                                                    errorText = `Синтаксическая ошибка: ожидается 'g' для завершения слова 'integer', найден '${symbol}'`;
                                                }
                                            } else {
                                                state = States.E;
                                                index = pos;
                                                errorText = `Синтаксическая ошибка: ожидается 'e' для завершения слова 'integer', найден '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Синтаксическая ошибка: ожидается 't' для завершения слова 'integer', найден '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Синтаксическая ошибка: ожидается 'n' для завершения слова 'integer', найден '${symbol}'`;
                                    }
                                    break;
                                }
                                case 'r': { // Для слова 'real'
                                    pos++;
                                    symbol = str[pos];
                                    if (symbol === 'e') {
                                        pos++;
                                        symbol = str[pos];
                                        if (symbol === 'a') {
                                            pos++;
                                            symbol = str[pos];
                                            if (symbol === 'l') {
                                                // Сохраняем 'real' в map
                                                for (const id of semantics.keys()) {
                                                    if (semantics.get(id) === null) {
                                                        semantics.set(id, `array[${arraySem}] of real`);
                                                    }
                                                }
                                                state = States.I30;
                                                pos++;
                                                symbol = str[pos];
                                                break;
                                            } else {
                                                state = States.E;
                                                index = pos;
                                                errorText = `Синтаксическая ошибка: ожидается 'l' для завершения слова 'real', найден '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Синтаксическая ошибка: ожидается 'a' для завершения слова 'real', найден '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Синтаксическая ошибка: ожидается 'e' для завершения слова 'real', найден '${symbol}'`;
                                    }
                                    break;
                                }
                                case 'c': { // Для слова 'char'
                                    pos++;
                                    symbol = str[pos];
                                    if (symbol === 'h') {
                                        pos++;
                                        symbol = str[pos];
                                        if (symbol === 'a') {
                                            pos++;
                                            symbol = str[pos];
                                            if (symbol === 'r') {
                                                // Сохраняем 'char' в map
                                                for (const id of semantics.keys()) {
                                                    if (semantics.get(id) === null) {
                                                        semantics.set(id, `array[${arraySem}] of char`);
                                                    }
                                                }
                                                state = States.I30;
                                                pos++;
                                                symbol = str[pos];
                                                break;
                                            } else {
                                                state = States.E;
                                                index = pos;
                                                errorText = `Синтаксическая ошибка: ожидается 'r' для завершения слова 'char', найден '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Синтаксическая ошибка: ожидается 'a' для завершения слова 'char', найден '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Синтаксическая ошибка: ожидается 'h' для завершения слова 'char', найден '${symbol}'`;
                                    }
                                    break;
                                }
                                case 'd': {
                                    pos++;
                                    symbol = str[pos];
                                    if (symbol === 'o') {
                                        pos++;
                                        symbol = str[pos];
                                        if (symbol === 'u') {
                                            pos++;
                                            symbol = str[pos];
                                            if (symbol === 'b') {
                                                pos++;
                                                symbol = str[pos];
                                                if (symbol === 'l') {
                                                    pos++;
                                                    symbol = str[pos];
                                                    if (symbol === 'e') {
                                                        for (const id of semantics.keys()) {
                                                            if (semantics.get(id) === null) {
                                                                semantics.set(id, `array[${arraySem}] of double`);
                                                            }
                                                        }
                                                        state = States.I30;
                                                        pos++;
                                                        symbol = str[pos];
                                                        break;
                                                    } else {
                                                        state = States.E;
                                                        index = pos;
                                                        errorText = `Синтаксическая ошибка: ожидается 'e' для завершения слова 'double', найден '${symbol}'`;
                                                    }
                                                } else {
                                                    state = States.E;
                                                    index = pos;
                                                    errorText = `Синтаксическая ошибка: ожидается 'l' для завершения слова 'double', найден '${symbol}'`;
                                                }
                                            } else {
                                                state = States.E;
                                                index = pos;
                                                errorText = `Синтаксическая ошибка: ожидается 'b' для завершения слова 'double', найден '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Синтаксическая ошибка: ожидается 'u' для завершения слова 'double', найден '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Синтаксическая ошибка: ожидается 'o' для завершения слова 'double', найден '${symbol}'`;
                                    }
                                    break;
                                }
                                default: {
                                    state = States.E;
                                    index = pos;
                                    errorText = `Синтаксическая ошибка: найден некорректный символ '${symbol}', ожидается один из символов 'b', 'w', 'i', 'r', 'c', 'd'`;
                                    break;
                                }
                            }
                        }
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        break;
                    }
                    case States.I30: {
                        console.log(`Текущий символ: ${symbol}, Позиция: ${pos}, Состояние: ${state}`);
                        switch (symbol) {
                            case ' ': {
                                state = States.I30;
                                break;
                            }
                            case ',': {
                                state = States.B2;
                                break;
                            }
                            case ';': {
                                state = States.F;
                                break;
                            }
                            default: {
                                state = States.E;
                                index = pos;
                                errorText = `Синтаксическая ошибка: недопустимый символ '${symbol}', ожидается  ' ', ',' или ';'`;
                            }
                        }
                        pos++;
                        break;
                    }
                    default: {
                        state = States.E;
                        index = pos;
                        errorText = `Необработанное состояние: ${state}`
                    }
                }
            }
        } catch (error) {
            console.error('Произошла ошибка в процессе анализа строки:', error);
            return {
                success: false,
                message: 'Произошла непредвиденная ошибка!',
            };
        }

        if (state === States.F) {
            console.log('Цепочка принадлежит языку');
            return {
                success: true,
                message: 'Цепочка принадлежит языку!',
                table: Array.from(semantics.entries()),
            };
        }

        if (state === States.E) {
            console.log(`Ошибка: ${errorText}`);
            return {
                success: false,
                message: errorText,
                errorIndex: index,
                highlightedText: str.substring(0, index) +
                    `<span style="color: red; text-decoration: underline;">${str[index]}</span>` +
                    str.substring(index + 1),
            };
        }
        return {
            success: false,
            message: "Ошибка: входная строка не завершена. Ожидается ';'.",
            errorIndex: strLen,
            highlightedText: str + `<span style="color: red;">&nbsp;_</span>`,
        };

        function checkRange(value) {
            const number = parseInt(value, 10);
            return number >= -32768 && number <= 32767;
        }

    };


    return {
        analyzedString: analyzedString,  // Экспортируем analyzedString
    };
})();








