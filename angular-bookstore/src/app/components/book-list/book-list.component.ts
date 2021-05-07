import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from 'src/app/common/book';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-book-list',
  //templateUrl: './book-list.component.html',
  templateUrl: './book-grid.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: Book[];
  currentCategoryId: number;
  searchMode :boolean;

  constructor(private bookService: BookService, private activatedRoute: ActivatedRoute) { }

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
  }else{
    //display book base on category
    this.handleListBooks();
  }
  }

  handleListBooks(){
    const hasCategoryId: boolean = this.activatedRoute.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      this.currentCategoryId = +this.activatedRoute.snapshot.paramMap.get('id');
    } else {
      this.currentCategoryId = 1;
    }

    this.bookService.getBooks(this.currentCategoryId).subscribe(
      data => this.books = data
    )
  }
  handleSearchBooks(){
   const keyword :string = this.activatedRoute.snapshot.paramMap.get('keyword');

   this.bookService.searchBooks(keyword).subscribe(
     data=> this.books=data
   )
  }

}
