const editor = document.getElementById('editor');
const preview = document.getElementsByTagName('article')[0];

// Wraps each <h1> section and its following content in a <section> tag
function wrapH1Sections(html) {
    const regex = /(<h1[\s\S]*?<\/h1>)([\s\S]*?)(?=<h1|$)/g;
    return html.replace(regex, (match, h1, content) => `<section>\n${h1}${content}\n</section>`);
}

// Wraps <img> elements in <figure> with a <figcaption>
function wrapImagesWithFigure(html) {
    return html.replace(
        /<img\s+src="([^"]+)"\s+alt="([^"]+)"\s*\/?>/g,
        `<figure>
  <img src="$1" alt="$2">
  <figcaption>$2</figcaption>
</figure>`
    );
}

// Converts blockquote footers into <footer> and <cite>
function convertQuoteFooter(html) {
    return html.replace(
        /<blockquote>\s*<p>([\s\S]+?)<\/p>\s*<p>[—-]{1,2}\s*(.+?)<\/p>\s*<\/blockquote>/g,
        (_, quote, author) => `<blockquote>
  <p>${quote.trim()}</p>
  <footer><cite>${author.trim()}</cite></footer>
</blockquote>`
    );
}

// Wraps text nodes containing quoted text in <q> tags
function wrapQuotesInTextNodes(rootElement) {
    const walker = document.createTreeWalker(rootElement, NodeFilter.SHOW_TEXT, null, false);
    const nodesToReplace = [];

    let node;
    while ((node = walker.nextNode())) {
        if (node.nodeValue.includes('"')) {
            nodesToReplace.push(node);
        }
    }

    for (const textNode of nodesToReplace) {
        const replaced = textNode.nodeValue.replace(/"([^"]+?)"/g, '<q>$1</q>');
        if (replaced !== textNode.nodeValue) {
            const span = document.createElement('span');
            span.innerHTML = replaced;
            textNode.parentNode.replaceChild(span, textNode);
        }
    }
}

// Preview function
function previewArticle(d) {
    const content = editor.value;
    const parsedContent = marked.parse(content);            // Parse Markdown content
    let wrappedContent = wrapH1Sections(parsedContent);      // Wrap <h1> sections
    wrappedContent = wrapImagesWithFigure(wrappedContent);   // Wrap images with <figure>
    wrappedContent = convertQuoteFooter(wrappedContent);     // Convert quote footers
    preview.innerHTML = wrappedContent;                       // Render wrapped content
    wrapQuotesInTextNodes(preview);                           // Wrap quoted text nodes in <q>

    Prism.highlightAll();                                     // Highlight code blocks using Prism.js

    // Render math expressions with KaTeX
    if (typeof renderMathInElement === 'function') {
        renderMathInElement(preview, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false }
            ],
            throwOnError: false
        });
    }
}

// Main input event listener for the editor
editor.addEventListener('input', () => {
    previewArticle();  // Call the preview function on input
});

// Initial preview rendering
document.addEventListener('DOMContentLoaded', () => {
    previewArticle();  // Render the initial preview when the document is ready
});

// Toggle preview visibility
const togglePreviewButton = document.getElementById('show-preview');
togglePreviewButton.addEventListener('click', () => {
    preview.classList.toggle('hidden'); // Toggle preview visibility
    editor.parentElement.classList.toggle('hidden'); // Toggle editor visibility
    togglePreviewButton.textContent = preview.classList.contains('hidden') ? 'Show Preview' : 'Hide Preview'; // Update button text
});

// Save button functionality with file name prompt
const saveButton = document.getElementById('save');
saveButton.addEventListener('click', () => {
    const content = editor.value; // Get the content of the textarea
    const fileName = prompt('Enter file name:', 'content.txt'); // Ask the user for a file name

    if (fileName) { // Proceed only if the user provides a file name
        const blob = new Blob([content], { type: 'text/plain' }); // Create a Blob object
        const url = URL.createObjectURL(blob); // Create a URL for the Blob
        const a = document.createElement('a'); // Create an anchor element
        a.href = url; // Set the href to the Blob URL
        a.download = fileName; // Set the file name
        a.click(); // Trigger the download
        URL.revokeObjectURL(url); // Revoke the Blob URL to free memory
    }
});

// Load button functionality to load content from a file
const loadButton = document.getElementById('load');
loadButton.addEventListener('click', () => {
    const input = document.createElement('input'); // Create a file input element
    input.type = 'file'; // Set the input type to file
    input.accept = '.txt'; // Restrict file types to .txt files

    input.addEventListener('change', (event) => {
        const file = event.target.files[0]; // Get the selected file
        if (file) {
            const reader = new FileReader(); // Create a FileReader to read the file
            reader.onload = (e) => {
                editor.value = e.target.result; // Set the textarea content to the file content
                previewArticle(); // Update the preview
            };
            reader.readAsText(file); // Read the file as text
        }
    });

    input.click(); // Trigger the file input dialog
});

// Render button functionality to render the content
const renderButton = document.getElementById('render');
renderButton.addEventListener('click', () => {
    const content = preview.innerHTML; // Get the HTML content of the <article>
    const fileName = prompt('Enter file name for rendered content:', 'rendered-content.html'); // Ask for file name

    if (fileName) { // Proceed only if the user provides a file name
        const blob = new Blob([content], { type: 'text/html' }); // Create a Blob object with HTML content
        const url = URL.createObjectURL(blob); // Create a URL for the Blob
        const a = document.createElement('a'); // Create an anchor element
        a.href = url; // Set the href to the Blob URL
        a.download = fileName; // Set the file name
        a.click(); // Trigger the download
        URL.revokeObjectURL(url); // Revoke the Blob URL to free memory
    }
});