import * as request from 'supertest';
import { bootstrapApp, BootstrapSettings } from '../utils/bootstrap';
import { OperatorRepository } from '../../../src/api/repositories/OperatorRepository';
import { Operator } from '../../../src/api/models/Operator';
import { valueOrUndefined } from 'src/api/types/ValueOrUndefined';


describe('/api login function... ', () => {

    // -------------------------------------------------------------------------
    // Setup up
    // -------------------------------------------------------------------------
    let bruce: valueOrUndefined<Operator>;
    let repos: OperatorRepository;
    let settings: BootstrapSettings;
    beforeAll(async () => settings = await bootstrapApp());
    beforeAll(async () => repos = await settings.connection.getCustomRepository(OperatorRepository));
    beforeAll(async () => bruce = await repos.findOneById(1));

    // -------------------------------------------------------------------------
    //     Test cases
    // -------------------------------------------------------------------------

    test('POST: /login with username and password should return an Operator object', async (done) => {
        if (!bruce) { bruce = new Operator(); }
        const response = await request(settings.app)
            .post(`/api/login/operator?username=${bruce.login}&password=${bruce.pwd}`)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.id).toBe(bruce.id);
        expect(response.body.firstname).toBe(bruce.firstname);
        expect(response.body.lastname).toBe(bruce.lastname);
        bruce = response.body;
        done();
    });

    test('GET: /logout with valid token should return no error', async (done) => {

        if (!bruce) { bruce = new Operator(); }
        const response = await request(settings.app)
            .get(`/api/logout`)
            .set('Authorization', `Bearer ${bruce.token.token_session}`)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toBe(true);
        done();
    });

});

