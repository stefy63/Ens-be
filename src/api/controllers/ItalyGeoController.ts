import { JsonController, Authorized, Get, Param } from 'routing-controllers';
import { ComuniItaliaService } from '../services/ComuniItaliaService';
import { ProvinceItaliaService } from '../services/ProvinceItaliaService';
import { RegioniItaliaService } from '../services/RegioniItaliaService';
import { ComuniItalia } from '../models/ComuniItalia';
import { valueOrUndefined } from '../types/ValueOrUndefined';
import { ProvinceItalia } from '../models/ProvinceItalia';
import { RegioniItalia } from '../models/RegioniItalia';
import { ResponseSchema } from 'routing-controllers-openapi';

@JsonController('/italyGeo')
export class ItalyGeoController {
    constructor(
        private comuniService: ComuniItaliaService,
        private provinceService: ProvinceItaliaService,
        private regioniService: RegioniItaliaService
    ) { }

    @Authorized()
    @Get("/comuni")
    @ResponseSchema(ComuniItalia, {isArray: true})
    public async getComuni(): Promise<valueOrUndefined<ComuniItalia[]>> {
        return await this.comuniService.getAll();
    }

    @Authorized()
    @Get("/comune/:id")
    @ResponseSchema(ComuniItalia)
    public async getOneComune(@Param('id') idComune: number): Promise<valueOrUndefined<ComuniItalia>> {
        return await this.comuniService.findOne(idComune);
    }

    @Authorized()
    @Get("/province")
    @ResponseSchema(ProvinceItalia, {isArray: true})
    public async getProvince(): Promise<ProvinceItalia[]> {
        return await this.provinceService.getAll();
    }

    @Authorized()
    @Get("/provincia/:id")
    @ResponseSchema(ProvinceItalia)
    public async getOneProvincia(@Param('id') idProvincia: number): Promise<valueOrUndefined<ProvinceItalia>> {
        return await this.provinceService.findOne(idProvincia);
    }

    @Authorized()
    @Get("/regioni")
    @ResponseSchema(RegioniItalia, {isArray: true})
    public async getRegioni(): Promise<RegioniItalia[]> {
        return await this.regioniService.getAll();
    }

    @Authorized()
    @Get("/regioni/:id")
    @ResponseSchema(RegioniItalia)
    public async getOneRegione(@Param('id') idRegione: number): Promise<valueOrUndefined<RegioniItalia>> {
        return await this.regioniService.findOne(idRegione);
    }
}
