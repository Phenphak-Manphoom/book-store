import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from 'src/app/common/book';
import { BookService } from 'src/app/services/book.service';
import {NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-book-list',
  //templateUrl: './book-list.component.html',
  templateUrl: './book-grid.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  currentCategoryId: number;
  searchMode: boolean = false;
  previousCategory:number=1;

  //new properties for server side paging
  currentPage: number = 1;
  pageSize: number = 5;
  totalRecords: number = 0;




  constructor(private bookService: BookService, private activatedRoute: ActivatedRoute, config :NgbPaginationConfig) {
    config.maxSize=3; //config paginate
    config.boundaryLinks=true;

  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(() => {
      this.listBooks();
    })

  }



  listBooks() {
    this.searchMode = this.activatedRoute.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      //do search work
      this.handleSearchBooks();
    } else {
      //display book base on category
      this.handleListBooks();
    }
  }

  handleListBooks() {
    const hasCategoryId: boolean = this.activatedRoute.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      this.currentCategoryId = +this.activatedRoute.snapshot.paramMap.get('id');
    } else {
      this.currentCategoryId = 1;
    }
    //setting up the current page to 1
    //if user navigates to other category
    if (this.previousCategory != this.currentCategoryId) {
      this.currentPage=1;
    }
    this.previousCategory=this.currentCategoryId

    this.bookService.getBooks(this.currentCategoryId,
      this.currentPage - 1,
      this.pageSize)
      .subscribe(
        this.processPaginate()
      );
  }
  handleSearchBooks() {
    const keyword: string = this.activatedRoute.snapshot.paramMap.get('keyword');

    this.bookService.searchBooks(keyword,
                                 this.currentPage -1,
                                 this.pageSize)
                                 .subscribe(this.processPaginate())

  }
  updatePageSize(pageSize: number) {
    this.pageSize=pageSize;
    this.currentPage=1;
    this.listBooks();
  }

  processPaginate(){
    return data => {
      this.books = data._embedded.books;
      this.currentPage = data.page.number + 1;
      this.totalRecords = data.page.totalElements;
      this.pageSize = data.page.size;
    }
  }
}
