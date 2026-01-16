import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { PaginationService } from './pagination.service';

describe('PaginationService', () => {
  let service: PaginationService;
  let mockRouter: any;
  let mockActivatedRoute: any;

  beforeEach(() => {
    mockRouter = {
      navigate: jest.fn().mockResolvedValue(true),
    };

    mockActivatedRoute = {
      snapshot: {
        queryParams: {},
      },
    };

    TestBed.configureTestingModule({
      providers: [
        PaginationService,
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });

    service = TestBed.inject(PaginationService);
  });

  it('should set the default page', () => {
    expect(service.currentPage()).toBeNull();
    expect(service.maxPage()).toBeNull();
  });

  it('should change the page and call the router', async () => {
    service.maxPage.set(10);
    service.changePage(5);

    expect(mockRouter.navigate).toHaveBeenCalledWith([], {
      relativeTo: mockActivatedRoute,
      queryParams: { page: 5 },
      queryParamsHandling: 'merge',
    });
  });

  it('should not change the page for invalid data', () => {
    service.maxPage.set(10);
    service.changePage(0);
    expect(mockRouter.navigate).not.toHaveBeenCalled();

    service.changePage(11);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should calculate correct visible pages', () => {
    service.maxPage.set(10);
    service.currentPage.set(1);

    const pagesList = service.pagesList();

    const visible = service.calculateVisiblePages(1, 10, pagesList);
    expect(visible).toEqual([1, 2, 3, '...', 10]);

    const middlePages = service.calculateVisiblePages(5, 10, pagesList);
    expect(middlePages).toEqual([1, '...', 4, 5, 6, '...', 10]);
  });
});
