module.exports = {
    get: () => {
        return Promise.resolve({
            isLoading: false,
            vanityNumbers: [
                {
                    'customer-number': '+38976111111',
                    'vanity-numbers': ['+3897611ABCD', '+3897611EFGH', '+3897611IJKL', '+3897611MNOP', '+3897611QRST' ]
                },
                {
                    'customer-number': '+38976222222',
                    'vanity-numbers': ['+3897622ABCD', '+3897622EFGH', '+3897622IJKL', '+3897622MNOP', '+3897622QRST' ]
                },
                {
                    'customer-number': '+38976333333',
                    'vanity-numbers': ['+3897633ABCD', '+3897633EFGH', '+3897633IJKL', '+3897633MNOP', '+3897633QRST' ]
                },
                {
                    'customer-number': '+38976444444',
                    'vanity-numbers': ['+3897644ABCD', '+3897644EFGH', '+3897644IJKL', '+3897644MNOP', '+3897644QRST' ]
                },
                {
                    'customer-number': '+38976555555',
                    'vanity-numbers': ['+3897655ABCD', '+3897655EFGH', '+3897655IJKL', '+3897655MNOP', '+3897655QRST' ]
                }
            ]
        })
    }
}