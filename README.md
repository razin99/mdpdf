# mdpdf - Convert markdown to pdf

Generate pdf from markdown and include table of contents.

Uses `remark-toc` to generate toc and `md-to-pdf` to generate pdf.The
css styles are from github markdown.

## Installation
```console
$ git clone 'https://github.com/razin99/mdpdf.git'
$ cd mdpdf
$ npm run build
# compile typescript files
$ npm -g install
# may need sudo
```
I don't feel like uploading this to npm, lmao.

## Usage
### Convert 1 file
```console
$ mdpdf file.md
```
### Convert multiple file
```console
$ mdpdf file1.md file2.md file3.md
```
### Convert file to a directory that exists
```console
$ mdpdf file1.md [... other markdown files] --outdir build_dir
```
### Convert file to a directory that does not exists
```console
$ mdpdf file1.md [... other markdown files] --parent --outdir build_dir
```

## Why this exists?

Initially, I just wanted to make a simple script that uses `remark-toc` and
`md-to-pdf` to make a pdf.

But I decided that its probably cooler if its a 'CLI' tool. I tried
using typescript, but I have no idea how to use it properly.

## Some quirks

Insert page break? Use:
```html
<div class="page-break"></div>
```

Insert toc? Use:
```markdown
# Table of Contents

#
```
Need the extra `#` so that `remark-toc` stops there. Only useful if you
need to insert page break after toc.

## Future plans
- [ ] Use something like `chokidar` to do some sort of live preview and make
  it a vscode plugin.
- [ ] Find better way to insert page break after toc.
- [ ] Make CLI accept more flags to change config of `md-to-pdf`
- [x] Migrate to Typescript
- [ ] Parse frontmatter for meta-data and configs


