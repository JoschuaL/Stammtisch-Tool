import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController  } from "@angular/common/http/testing";
import { ReportDatabaseService } from './report-database.service';
import { HttpClient} from "@angular/common/http";

describe('HttpClient testing', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [ HttpClientTestingModule ]
    });
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('works', () => {
          expect(HttpClient).toBeDefined();
  });
});

describe('ReportDatabaseService', () => {
    let reportDatabaseServiceice: ReportDatabaseService;

    beforeEach( ()=> {
        TestBed.configureTestingModule({
            declarations: [],
            imports: [
                ReportDatabaseService
            ],
            providers: [
                ReportDatabaseService
            ]
        });
    });

    it('should create service', () => {
      expect(ReportDatabaseService).toBeDefined();
    });
    it('should have a constructor', () => {
      expect(ReportDatabaseService.constructor).toBeDefined();
    });


});