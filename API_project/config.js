const environment = {
    staging: {
        'httpPort': 3000,
        'httpsPort': 3001,
        'cryptoSecret': 'staging',
        'envName': 'staging',
    },
    production: {
        'httpPort': 5000,
        'httpsPort': 5001,
        'cryptoSecret': 'production',
        'envName': 'production'
    }
};

const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : '';

const envToExport = typeof environment[currentEnvironment] === 'object' ?
                    environment[currentEnvironment]:environment.staging;
module.exports= envToExport;
