package com.coding.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.coding.bookstore.entity.Book;

public interface BookRepository extends JpaRepository<Book, Long> {
	

}
