export interface BibTexEntry {
    type: string;
    author: string;
    booktitle: string;
    title: string;
    year: number;
    volume?: string;
    number?: string;
    pages: string;
    abstract: string;
    keywords: string;
    doi?: string;
    issn?: string;
    month: string;
    journal?: string; // Article
    editor?: string; // Book, Proceedings
    edition?: string; // Book
    series?: string; // Book, Proceedings
    address?: string; // Book, Proceedings, Techreport
    isbn?: string; // Book, Proceedings
    institution?: string; // Techreport
    school?: string; // Phdthesis, Mastersthesis
    organization?: string; // Inproceedings, Proceedings
    howpublished?: string; // Misc
}

