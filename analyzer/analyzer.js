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
                        switch (symbol) {
                            case ' ':
                                state = States.S;
                                pos++;
                                break;
                            case 'v':
                                state = States.VAR1;
                                pos++;
                                symbol = str[pos];
                                if (symbol === 'a') {
                                    state = States.VAR2;
                                    pos++;
                                    symbol = str[pos];
                                    if (symbol === 'r') {
                                        state = States.A1;
                                        pos++;
                                        symbol = str[pos];
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = "Syntax error: invalid symbol, expected symbol 'r'";
                                    }
                                } else {
                                    state = States.E;
                                    index = pos;
                                    errorText = "Syntax error: invalid symbol, expected symbol 'a'";
                                }
                                break;
                            default:
                                state = States.E;
                                index = pos;
                                errorText = "Syntax error: invalid symbol, expected symbol ' ' or 'v'";
                                break;
                        }
                        break;
                    }
                    case States.A1: {
                        switch (symbol) {
                            case ' ':
                                state = States.B2;
                                pos++;
                                symbol = str[pos];
                                break;
                            default:
                                state = States.E;
                                index = pos;
                                errorText = "Syntax error: invalid symbol, expected symbol ' '";
                                break;
                        }
                        break;
                    }
                    case States.B2: {
                        arraySem = '';
                        switch (symbol) {
                            case ' ':
                                state = States.B2;
                                pos++;
                                break;
                            default:
                                if (symbol >= 'a' && symbol <= 'z') {
                                    sem = '' + symbol;
                                    state = States.C3;
                                    pos++;
                                    symbol = str[pos];
                                } else {
                                    state = States.E;
                                    index = pos;
                                    errorText = "Syntax error: invalid symbol, expected symbol ' ' or 'a|...|z'";
                                }
                                break;
                        }
                        break;
                    }
                    case States.C3: {
                        if ((symbol >= 'a' && symbol <= 'z') || (symbol >= '0' && symbol <= '9')) {
                            sem += symbol;
                            if (sem.length > 8) {
                                state = States.E;
                                index = pos - sem.length + 1;
                                errorText = `Semantic error: identifier length '${sem}' exceeds 8 symbols`;
                            } else {
                                state = States.C3;
                            }
                        } else if (symbol === ',') {
                            if (['var', 'byte', 'word', 'integer', 'real', 'char', 'double', 'array'].includes(sem.toLowerCase())) {
                                state = States.E;
                                index = pos - sem.length;
                                errorText = `Semantic error: identifier '${sem}' cannot be a reserved word`;
                            } else if (semantics.has(sem)) {
                                state = States.E;
                                index = pos - sem.length;
                                errorText = `Semantic error: identifier '${sem}' is already declared`;
                            } else {
                                semantics.set(sem, null);
                                sem = '';
                                state = States.B2;
                            }
                        } else if (symbol === ':') {
                            if (['var', 'byte', 'word', 'integer', 'real', 'char', 'double', 'array'].includes(sem.toLowerCase())) {
                                state = States.E;
                                index = pos - sem.length;
                                errorText = `Semantic error: identifier '${sem}' cannot be a reserved word`;
                            } else if (semantics.has(sem)) {
                                state = States.E;
                                index = pos - sem.length;
                                errorText = `Semantic error: identifier '${sem}' is already declared`;
                            } else {
                                semantics.set(sem, null);
                                sem = '';
                                state = States.D4;
                            }
                        } else if (symbol === ' ') {
                            if (['var', 'byte', 'word', 'integer', 'real', 'char', 'double', 'array'].includes(sem.toLowerCase())) {
                                state = States.E;
                                index = pos - sem.length;
                                errorText = `Semantic error: identifier '${sem}' cannot be a reserved word`;
                            } else if (semantics.has(sem)) {
                                state = States.E;
                                index = pos - sem.length;
                                errorText = `Semantic error: identifier '${sem}' is already declared`;
                            } else {
                                semantics.set(sem, null);
                                sem = '';
                                state = States.K9;
                            }
                        } else {
                            state = States.E;
                            index = pos;
                            errorText = `Syntax error: invalid symbol '${symbol}' in identifier`;
                        }
                        pos++;
                        symbol = str[pos];
                        break;
                    }
                    case States.K9: {
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
                                errorText = "Syntax error: invalid symbol, expected symbol ' ', ',' or ':'";
                                break;
                            }
                        }
                        pos++;
                        break;
                    }
                    case States.D4: {
                        if (symbol === 'a') {
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
                                    pos++;
                                    symbol = str[pos];
                                    if (symbol === 'y') {
                                        pos++;
                                        symbol = str[pos];
                                        if (symbol === 't') {
                                            pos++;
                                            symbol = str[pos];
                                            if (symbol === 'e') {
                                                for (const id of semantics.keys()) {
                                                    if (semantics.get(id) === null) {
                                                        semantics.set(id, 'byte');
                                                    }
                                                }
                                                state = States.I7;
                                                pos++;
                                                symbol = str[pos];
                                                break;
                                            } else {
                                                state = States.E;
                                                index = pos;
                                                errorText = `Syntax error: expected 'e' to complete the word 'byte', but found '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Syntax error: expected 't' to complete the word 'byte', but found '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Syntax error: expected 'y' to complete the word 'byte', but found '${symbol}'`;
                                    }
                                    break;
                                }
                                case 'w': {
                                    pos++;
                                    symbol = str[pos];
                                    if (symbol === 'o') {
                                        pos++;
                                        symbol = str[pos];
                                        if (symbol === 'r') {
                                            pos++;
                                            symbol = str[pos];
                                            if (symbol === 'd') {
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
                                                errorText = `Syntax error: expected 'd' to complete the word 'word', but found '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Syntax error: expected 'r' to complete the word 'word', but found '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Syntax error: expected 'o' to complete the word 'word', but found '${symbol}'`;
                                    }
                                    break;
                                }
                                case 'i': {
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
                                                            errorText = `Syntax error: expected 'r' to complete the word 'integer', but found '${symbol}'`;
                                                        }
                                                    } else {
                                                        state = States.E;
                                                        index = pos;
                                                        errorText = `Syntax error: expected 'e' to complete the word 'integer', but found '${symbol}'`;
                                                    }
                                                } else {
                                                    state = States.E;
                                                    index = pos;
                                                    errorText = `Syntax error: expected 'g' to complete the word 'integer', but found '${symbol}'`;
                                                }
                                            } else {
                                                state = States.E;
                                                index = pos;
                                                errorText = `Syntax error: expected 'e' to complete the word 'integer', but found '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Syntax error: expected 't' to complete the word 'integer', but found '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Syntax error: expected 'n' to complete the word 'integer', but found '${symbol}'`;
                                    }
                                    break;
                                }
                                case 'r': {
                                    pos++;
                                    symbol = str[pos];
                                    if (symbol === 'e') {
                                        pos++;
                                        symbol = str[pos];
                                        if (symbol === 'a') {
                                            pos++;
                                            symbol = str[pos];
                                            if (symbol === 'l') {
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
                                                errorText = `Syntax error: expected 'l' to complete the word 'real', but found '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Syntax error: expected 'a' to complete the word 'real', but found '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Syntax error: expected 'e' to complete the word 'real', but found '${symbol}'`;
                                    }
                                    break;
                                }
                                case 'c': {
                                    pos++;
                                    symbol = str[pos];
                                    if (symbol === 'h') {
                                        pos++;
                                        symbol = str[pos];
                                        if (symbol === 'a') {
                                            pos++;
                                            symbol = str[pos];
                                            if (symbol === 'r') {
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
                                                errorText = `Syntax error: expected 'r' to complete the word 'char', but found '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Syntax error: expected 'a' to complete the word 'char', but found '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Syntax error: expected 'h' to complete the word 'char', but found '${symbol}'`;
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
                                                        errorText = `Syntax error: expected 'e' to complete the word 'double', but found '${symbol}'`;
                                                    }
                                                } else {
                                                    state = States.E;
                                                    index = pos;
                                                    errorText = `Syntax error: expected 'l' to complete the word 'double', but found '${symbol}'`;
                                                }
                                            } else {
                                                state = States.E;
                                                index = pos;
                                                errorText = `Syntax error: expected 'b' to complete the word 'double', but found '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Syntax error: expected 'u' to complete the word 'double', but found '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Syntax error: expected 'o' to complete the word 'double', but found '${symbol}'`;
                                    }
                                    break;
                                }
                                default: {
                                    state = States.E;
                                    index = pos;
                                    errorText = `Syntax error: unexpected character '${symbol}', expected one of 'b', 'w', 'i', 'r', 'c', 'd'`;
                                    break;
                                }
                            }
                        }
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
                                    if (symbol === 'y') {
                                        pos++
                                        symbol = str[pos];
                                        if (symbol === 't') {
                                            pos++
                                            symbol = str[pos];
                                            if (symbol === 'e') {
                                                for (const id of semantics.keys()) {
                                                    if (semantics.get(id) === null) {
                                                        semantics.set(id, 'byte');
                                                    }
                                                }
                                                state = States.I7;
                                                pos++
                                                symbol = str[pos];
                                                break;
                                            } else {
                                                state = States.E;
                                                index = pos;
                                                errorText = `Syntax error: expected 'e' to complete the word 'byte', but found '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Syntax error: expected 't' to complete the word 'byte', but found '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Syntax error: expected 'y' to complete the word 'byte', but found '${symbol}'`;
                                    }
                                    break;
                                }
                                case 'w': {
                                    pos++;
                                    symbol = str[pos];
                                    if (symbol === 'o') {
                                        pos++;
                                        symbol = str[pos];
                                        if (symbol === 'r') {
                                            pos++;
                                            symbol = str[pos];
                                            if (symbol === 'd') {
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
                                                errorText = `Syntax error: expected 'd' to complete the word 'word', but found '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Syntax error: expected 'r' to complete the word 'word', but found '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Syntax error: expected 'o' to complete the word 'word', but found '${symbol}'`;
                                    }
                                    break;
                                }
                                case 'i': {
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
                                                            errorText = `Syntax error: expected 'r' to complete the word 'integer', but found '${symbol}'`;
                                                        }
                                                    } else {
                                                        state = States.E;
                                                        index = pos;
                                                        errorText = `Syntax error: expected 'e' to complete the word 'integer', but found '${symbol}'`;
                                                    }
                                                } else {
                                                    state = States.E;
                                                    index = pos;
                                                    errorText = `Syntax error: expected 'g' to complete the word 'integer', but found '${symbol}'`;
                                                }
                                            } else {
                                                state = States.E;
                                                index = pos;
                                                errorText = `Syntax error: expected 'e' to complete the word 'integer', but found '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Syntax error: expected 't' to complete the word 'integer', but found '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Syntax error: expected 'n' to complete the word 'integer', but found '${symbol}'`;
                                    }
                                    break;
                                }
                                case 'r': {
                                    pos++;
                                    symbol = str[pos];
                                    if (symbol === 'e') {
                                        pos++;
                                        symbol = str[pos];
                                        if (symbol === 'a') {
                                            pos++;
                                            symbol = str[pos];
                                            if (symbol === 'l') {
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
                                                errorText = `Syntax error: expected 'l' to complete the word 'real', but found '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Syntax error: expected 'a' to complete the word 'real', but found '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Syntax error: expected 'e' to complete the word 'real', but found '${symbol}'`;
                                    }
                                    break;
                                }
                                case 'c': {
                                    pos++;
                                    symbol = str[pos];
                                    if (symbol === 'h') {
                                        pos++;
                                        symbol = str[pos];
                                        if (symbol === 'a') {
                                            pos++;
                                            symbol = str[pos];
                                            if (symbol === 'r') {
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
                                                errorText = `Syntax error: expected 'r' to complete the word 'char', but found '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Syntax error: expected 'a' to complete the word 'char', but found '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Syntax error: expected 'h' to complete the word 'char', but found '${symbol}'`;
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
                                                        errorText = `Syntax error: expected 'e' to complete the word 'double', but found '${symbol}'`;
                                                    }
                                                } else {
                                                    state = States.E;
                                                    index = pos;
                                                    errorText = `Syntax error: expected 'l' to complete the word 'double', but found '${symbol}'`;
                                                }
                                            } else {
                                                state = States.E;
                                                index = pos;
                                                errorText = `Syntax error: expected 'b' to complete the word 'double', but found '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Syntax error: expected 'u' to complete the word 'double', but found '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Syntax error: expected 'o' to complete the word 'double', but found '${symbol}'`;
                                    }
                                    break;
                                }
                                default: {
                                    state = States.E;
                                    index = pos;
                                    errorText = `Syntax error: unexpected character '${symbol}', expected one of 'b', 'w', 'i', 'r', 'c', 'd'`;
                                    break;
                                }
                            }
                        }
                        break;
                    }
                    case States.I7: {
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
                                errorText = `Syntax error: invalid symbol '${symbol}', expected symbol ' ', ',' или ';'`;
                            }
                        }
                        pos++;
                        break;
                    }
                    case States.AR1:{
                        switch (symbol) {
                           case 'r':{
                               state = States.AR2;
                               break;
                           }
                           default: {
                               state = States.E;
                               index = pos;
                               errorText = `Syntax error: invalid symbol '${symbol}', expected symbol 'r'`;
                               break;
                           }
                        }
                        pos++;
                        break;
                    }
                    case States.AR2:{
                        switch (symbol) {
                            case 'r':{
                                state = States.AR3;
                                break;
                            }
                            default: {
                                state = States.E;
                                index = pos;
                                errorText = `Syntax error: invalid symbol '${symbol}', expected symbol 'r'`;
                                break;
                            }
                        }
                        pos++;
                        break;
                    }
                    case States.AR3:{
                        switch (symbol) {
                            case 'a':{
                                state = States.AR4;
                                break;
                            }
                            default: {
                                state = States.E;
                                index = pos;
                                errorText = `Syntax error: invalid symbol '${symbol}', expected symbol 'a'`;
                                break;
                            }
                        }
                        pos++;
                        break;
                    }
                    case States.AR4:{
                        switch (symbol) {
                            case 'y':{
                                state = States.J8;
                                break;
                            }
                            default: {
                                state = States.E;
                                index = pos;
                                errorText = `Syntax error: invalid symbol '${symbol}', expected symbol 'y'`;
                                break;
                            }
                        }
                        pos++;
                        break;
                    }
                    case States.J8:{
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
                                errorText = `Syntax error: invalid symbol '${symbol}', expected symbol  ' ' or '['`;
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.L10:{
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
                                    errorText = `Syntax error: invalid symbol '${symbol}', expected symbol  '0|...|9 ', '+', '-' or ' '`;
                                }
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.M11:{
                        switch (symbol) {
                            default: {
                                if (symbol >= '0' && symbol <= '9') {
                                    sem += symbol;
                                    state = States.N12;
                                }else{
                                    state = States.E;
                                    index = pos;
                                    errorText = `Syntax error: invalid symbol '${symbol}', expected symbol '0|...|9'`;
                                }
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.N12:{
                        switch (symbol) {
                            case ' ':{
                                if (checkRange(sem)) {
                                    firstConstValue = parseInt(sem, 10);
                                    state = States.P14;
                                } else {
                                    state = States.E;
                                    index = pos - sem.length;
                                    errorText = `Semantic error: the value of '${sem}' is out of the acceptable range [-32768, 32767]`;
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
                                    errorText = `Semantic error: the value of '${sem}' is out of the acceptable range [-32768, 32767]`;
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
                                    errorText = `Syntax error: invalid symbol '${symbol}', expected symbol  '0|...|9', ':' or ' '`;
                                }
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.P14:{
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
                                errorText = `Syntax error: invalid symbol '${symbol}', expected symbol ':' or ' '`;
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.O13:{
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
                                    errorText = `Syntax error: invalid symbol '${symbol}', expected symbol '0|...|9 ', '+', '-' or ' '`;
                                }
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.Q15:{
                        switch (symbol) {
                            default: {
                                if (symbol >= '0' && symbol <= '9') {
                                    sem += symbol;
                                    state = States.R16;
                                }else{
                                    state = States.E;
                                    index = pos;
                                    errorText = `Syntax error: invalid symbol '${symbol}', expected symbol  '0|...|9'`;
                                }
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.R16:{
                        switch (symbol) {
                            case ' ':{
                                if (checkRange(sem)) {
                                    secondConstValue = parseInt(sem, 10);
                                    if (secondConstValue <= firstConstValue){
                                        state = States.E;
                                        index = pos - secondConstValue.toString().length;
                                        errorText = `Semantic error: the value of constant 2 '${secondConstValue}' must be greater than the value of constant 1 '${firstConstValue}'.`;
                                    }else{
                                        state = States.W20;
                                    }
                                } else {
                                    state = States.E;
                                    index = pos-sem.length;
                                    errorText = `Semantic error: the value of '${sem}' is out of the acceptable range [-32768, 32767]`;
                                }
                                sem = '';
                                break;
                            }
                            case ']':{
                                if (checkRange(sem)) {
                                    secondConstValue = parseInt(sem, 10);
                                    if (secondConstValue <= firstConstValue){
                                        state = States.E;
                                        index = pos - secondConstValue.toString().length;
                                        errorText = `Semantic error: the value of constant 2 '${secondConstValue}' must be greater than the value of constant 1 '${firstConstValue}'.`;
                                    }else{
                                        state = States.C26;
                                    }
                                } else {
                                    state = States.E;
                                    index = pos-sem.length;
                                    errorText = `Semantic error: the value of '${sem}' is out of the acceptable range [-32768, 32767]`;
                                }
                                sem = '';
                                arraySem = `${firstConstValue}:${secondConstValue}`;
                                firstConstValue = 0;
                                secondConstValue = 0;
                                break;
                            }
                            case ',':{
                                if (checkRange(sem)) {
                                    secondConstValue = parseInt(sem, 10);
                                    if (secondConstValue <= firstConstValue){
                                        state = States.E;
                                        index = pos - secondConstValue.toString().length;
                                        errorText = `Semantic error: the value of constant 2 '${secondConstValue}' must be greater than the value of constant 1 '${firstConstValue}'.'`;
                                    }else{
                                        state = States.T17;
                                    }
                                } else {
                                    state = States.E;
                                    index = pos-sem.length;
                                    errorText = `Semantic error: the value of '${sem}' is out of the acceptable range [-32768, 32767]`;
                                }
                                sem = '';
                                arraySem = `${firstConstValue}:${secondConstValue}`;
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
                                    errorText = `Syntax error: invalid symbol '${symbol}', expected symbol  '0|...|9', ',',' ' or ']'`;
                                }
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.W20:{
                        switch (symbol) {
                            case ' ':{
                                state = States.W20;
                                break;
                            }
                            case ',':{
                                sem = '';
                                arraySem = `${firstConstValue}:${secondConstValue}`;
                                firstConstValue = 0;
                                secondConstValue = 0;
                                state = States.T17;
                                break;
                            }
                            case ']':{
                                sem = '';
                                arraySem = `${firstConstValue}:${secondConstValue}`;
                                firstConstValue = 0;
                                secondConstValue = 0;
                                state = States.C26;
                                break;
                            }
                            default: {
                                state = States.E;
                                index = pos;
                                errorText = `Syntax error: invalid symbol '${symbol}', expected symbol ',', ']' or ' '`;
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.T17:{
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
                                    errorText = `Syntax error: invalid symbol '${symbol}', expected symbol  '0|...|9 ', '+', '-' or ' '`;
                                }
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.U18:{
                        switch (symbol) {
                            default: {
                                if (symbol >= '0' && symbol <= '9') {
                                    sem += symbol;
                                    state = States.V19;
                                }else{
                                    state = States.E;
                                    index = pos;
                                    errorText = `Syntax error: invalid symbol '${symbol}', expected symbol '0|...|9'`;
                                }
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.V19:{
                        switch (symbol) {
                            case ' ':{
                                if (checkRange(sem)) {
                                    firstConstValue = parseInt(sem,10);
                                    state = States.Y22;
                                } else {
                                    state = States.E;
                                    index = pos-sem.length;
                                    errorText = `Semantic error: the value of '${sem}' is out of the acceptable range [-32768, 32767]`;
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
                                    errorText = `Semantic error: the value of '${sem}' is out of the acceptable range [-32768, 32767]`;
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
                                    errorText = `Syntax error: invalid symbol '${symbol}', expected symbol '0|...|9', ':' or ' '`;
                                }
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.Y22:{
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
                                errorText = `Syntax error: invalid symbol '${symbol}', expected symbol ':' or ' '`;
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.X21:{
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
                                    errorText = `Syntax error: invalid symbol '${symbol}', expected symbol '0|...|9 ', '+', '-' or ' '`;
                                }
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.Z23:{
                        switch (symbol) {
                            default: {
                                if (symbol >= '0' && symbol <= '9') {
                                    sem += symbol;
                                    state = States.A24;
                                }else{
                                    state = States.E;
                                    index = pos;
                                    errorText = `Syntax error: invalid symbol '${symbol}', expected symbol '0|...|9'`;
                                }
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.A24:{
                        switch (symbol) {
                            case ' ':{
                                if (checkRange(sem)) {
                                    secondConstValue = parseInt(sem, 10);
                                    if (secondConstValue <= firstConstValue){
                                        state = States.E;
                                        index = pos - secondConstValue.toString().length;
                                        errorText = `Semantic error: the value of constant 2 '${secondConstValue}' must be greater than the value of constant 1 '${firstConstValue}'.`;
                                    }else{
                                        state = States.B25;
                                    }
                                } else {
                                    state = States.E;
                                    index = pos-sem.length;
                                    errorText = `Semantic error: the value of '${sem}' is out of the acceptable range [-32768, 32767]`;
                                }
                                sem = '';
                                break;
                            }
                            case ']':{
                                if (checkRange(sem)) {
                                    secondConstValue = parseInt(sem, 10);
                                    if (secondConstValue <= firstConstValue){
                                        state = States.E;
                                        index = pos - secondConstValue.toString().length;
                                        errorText = `Semantic error: the value of constant 2 '${secondConstValue}' must be greater than the value of constant 1 '${firstConstValue}'`;
                                    }else{
                                        state = States.C26;
                                    }
                                } else {
                                    state = States.E;
                                    index = pos-sem.length;
                                    errorText = `Semantic error: the value of '${sem}' is out of the acceptable range [-32768, 32767]`;
                                }
                                sem = '';
                                arraySem += `,${firstConstValue}:${secondConstValue}`;
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
                                    errorText = `Syntax error: invalid symbol '${symbol}', expected symbol '0|...|9', ']' or ' '`;
                                }
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.B25:{
                        switch (symbol) {
                            case ' ':{
                                state = States.B25;
                                break;
                            }
                            case ']':{
                                sem = '';
                                arraySem += `,${firstConstValue}:${secondConstValue}`;
                                firstConstValue = 0;
                                secondConstValue = 0;
                                state = States.C26;
                                break;
                            }
                            default: {
                                state = States.E;
                                index = pos;
                                errorText = `Syntax error: invalid symbol '${symbol}', expected symbol ']' or ' '`;
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.C26:{
                        switch (symbol) {
                            case ' ':{
                                state = States.D27;
                                break;
                            }
                            default: {
                                state = States.E;
                                index = pos;
                                errorText = `Syntax error: invalid symbol '${symbol}', expected symbol ' '`;
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.D27:{
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
                                errorText = `Syntax error: invalid symbol '${symbol}', expected symbol 'o' or ' '`;
                                break;
                            }
                        }
                        pos++
                        break;
                    }
                    case States.OF1:{
                        switch (symbol) {
                            case 'f':{
                                state = States.G28;
                                break;
                            }
                            default: {
                                state = States.E;
                                index = pos;
                                errorText = `Syntax error: invalid symbol '${symbol}', expected symbol 'f'`;
                                break;
                            }
                        }
                        pos++;
                        break;
                    }
                    case States.G28: {
                        if (symbol === ' ') {
                            state = States.H29;
                            pos++;
                            symbol = str[pos];
                        }else {
                            state = States.E;
                            index = pos;
                            errorText = `Syntax error: invalid symbol '${symbol}', expected symbol ' '`;
                        }
                        break;
                    }
                    case States.H29: {
                        if (symbol === ' ') {
                            state = States.H29;
                            pos++;
                            symbol = str[pos];
                        } else {
                            switch (symbol) {
                                case 'b': {
                                    pos++
                                    symbol = str[pos];
                                    if (symbol === 'y') {
                                        pos++
                                        symbol = str[pos];
                                        if (symbol === 't') {
                                            pos++
                                            symbol = str[pos];
                                            if (symbol === 'e') {
                                                for (const id of semantics.keys()) {
                                                    if (semantics.get(id) === null) {
                                                        semantics.set(id, `array[${arraySem}] of byte`);
                                                    }
                                                }
                                                state = States.I30;
                                                pos++
                                                symbol = str[pos];
                                                break;
                                            } else {
                                                state = States.E;
                                                index = pos;
                                                errorText = `Syntax error: expected 'e' to complete the word 'byte', but found '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Syntax error: expected 't' to complete the word 'byte', but found '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Syntax error: expected 'y' to complete the word 'byte', but found '${symbol}'`;
                                    }
                                    break;
                                }
                                case 'w': {
                                    pos++;
                                    symbol = str[pos];
                                    if (symbol === 'o') {
                                        pos++;
                                        symbol = str[pos];
                                        if (symbol === 'r') {
                                            pos++;
                                            symbol = str[pos];
                                            if (symbol === 'd') {
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
                                                errorText = `Syntax error: expected 'd' to complete the word 'word', but found '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Syntax error: expected 'r' to complete the word 'word', but found '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Syntax error: expected 'o' to complete the word 'word', but found '${symbol}'`;
                                    }
                                    break;
                                }
                                case 'i': {
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
                                                            errorText = `Syntax error: expected 'r' to complete the word 'integer', but found '${symbol}'`;
                                                        }
                                                    } else {
                                                        state = States.E;
                                                        index = pos;
                                                        errorText = `Syntax error: expected 'e' to complete the word 'integer', but found '${symbol}'`;
                                                    }
                                                } else {
                                                    state = States.E;
                                                    index = pos;
                                                    errorText = `Syntax error: expected 'g' to complete the word 'integer', but found '${symbol}'`;
                                                }
                                            } else {
                                                state = States.E;
                                                index = pos;
                                                errorText = `Syntax error: expected 'e' to complete the word 'integer', but found '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Syntax error: expected 't' to complete the word 'integer', but found '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Syntax error: expected 'n' to complete the word 'integer', but found '${symbol}'`;
                                    }
                                    break;
                                }
                                case 'r': {
                                    pos++;
                                    symbol = str[pos];
                                    if (symbol === 'e') {
                                        pos++;
                                        symbol = str[pos];
                                        if (symbol === 'a') {
                                            pos++;
                                            symbol = str[pos];
                                            if (symbol === 'l') {
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
                                                errorText = `Syntax error: expected 'l' to complete the word 'real', but found '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Syntax error: expected 'a' to complete the word 'real', but found '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Syntax error: expected 'e' to complete the word 'real', but found '${symbol}'`;
                                    }
                                    break;
                                }
                                case 'c': {
                                    pos++;
                                    symbol = str[pos];
                                    if (symbol === 'h') {
                                        pos++;
                                        symbol = str[pos];
                                        if (symbol === 'a') {
                                            pos++;
                                            symbol = str[pos];
                                            if (symbol === 'r') {
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
                                                errorText = `Syntax error: expected 'r' to complete the word 'char', but found '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Syntax error: expected 'a' to complete the word 'char', but found '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Syntax error: expected 'h' to complete the word 'char', but found '${symbol}'`;
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
                                                        errorText = `Syntax error: expected 'e' to complete the word 'double', but found '${symbol}'`;
                                                    }
                                                } else {
                                                    state = States.E;
                                                    index = pos;
                                                    errorText = `Syntax error: expected 'l' to complete the word 'double', but found '${symbol}'`;
                                                }
                                            } else {
                                                state = States.E;
                                                index = pos;
                                                errorText = `Syntax error: expected 'b' to complete the word 'double', but found '${symbol}'`;
                                            }
                                        } else {
                                            state = States.E;
                                            index = pos;
                                            errorText = `Syntax error: expected 'u' to complete the word 'double', but found '${symbol}'`;
                                        }
                                    } else {
                                        state = States.E;
                                        index = pos;
                                        errorText = `Syntax error: expected 'o' to complete the word 'double', but found '${symbol}'`;
                                    }
                                    break;
                                }
                                default: {
                                    state = States.E;
                                    index = pos;
                                    errorText = `Syntax error: unexpected character '${symbol}', expected one of 'b', 'w', 'i', 'r', 'c', 'd'`;
                                    break;
                                }
                            }
                        }
                        break;
                    }
                    case States.I30: {
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
                                errorText = `Syntax error: invalid symbol '${symbol}', expected symbol  ' ', ',' or ';'`;
                            }
                        }
                        pos++;
                        break;
                    }
                    default: {
                        state = States.E;
                        index = pos;
                        errorText = `Raw state: ${state}`
                    }
                }
            }
        } catch (error) {
            return {
                success: false,
                message: 'An unexpected error has occurred!',
            };
        }

        if (state === States.F) {
            return {
                success: true,
                message: 'The chain belongs to the language!',
                table: Array.from(semantics.entries()),
            };
        }

        if (state === States.E) {
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
            message: "Error: The input line is incomplete. Expected ';'.",
            errorIndex: strLen,
            highlightedText: str + `<span style="color: red;">&nbsp;_</span>`,
        };

        function checkRange(value) {
            const number = parseInt(value, 10);
            return number >= -32768 && number <= 32767;
        }

    };


    return {
        analyzedString: analyzedString,
    };
})();








