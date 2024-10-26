$(document).ready(function() {
    console.log(2);
    // Load character limit from local storage or set default to 25
    let maxLength = localStorage.getItem('maxLength') ? parseInt(localStorage.getItem('maxLength')) : 25;
    $('#range').val(maxLength); // Set initial value of the range input

    // Function to remove text in square brackets
    const removeBrackets = (text) => {
        return text.replace(/\[[^\]]*\]/g, ''); // Remove [???] and its content
    };

    // Function to convert and copy the text
    const convertAndCopy = () => {
        const inputText = $('#input').val();
        const cleanedText = removeBrackets(inputText); // Remove brackets first
        // Split the cleaned text into lines and process each line
        const lines = cleanedText.split(/[\r\n]+/); // Split by line breaks
        const formattedLines = lines.map(line => addLineBreaks(line, maxLength)); // Adjust length as needed
        const formattedText = formattedLines.join('\n'); // Join lines back with line breaks
        $('#output').val(formattedText);

        // Copy the formatted text to clipboard
        navigator.clipboard.writeText(formattedText).then(function() {
            console.log('Converted text copied to clipboard successfully!');
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
        });
    };

    // Function to add line breaks for a single line with handling for short tails
    const addLineBreaks = (text, maxLength) => {
        let result = '';
        let currentLine = '';

        while (text.length > 0) {
            if (text.length <= maxLength) {
                result += text.trim();
                break;
            }

            // Find the best split point based on maxLength
            let breakPoint = maxLength;
            while (breakPoint > 0 && text[breakPoint] !== ' ' && text[breakPoint] !== ',') {
                breakPoint--;
            }

            // If no space/comma is found within maxLength, split in middle, keeping words intact
            if (breakPoint === 0) {
                breakPoint = maxLength;
                while (breakPoint < text.length && text[breakPoint] !== ' ' && text[breakPoint] !== ',') {
                    breakPoint++;
                }
            }

            // Get the current line up to the split point
            currentLine = text.slice(0, breakPoint).trim();
            text = text.slice(breakPoint).trim(); // Update remaining text

            // Check if the tail of the current line is shorter than 10 characters
            if (currentLine.length < maxLength && currentLine.length - currentLine.lastIndexOf(' ') < 10) {
                // If possible, break at the last comma before maxLength
                const commaIndex = currentLine.lastIndexOf(',');
                if (commaIndex > maxLength / 2) {
                    currentLine = currentLine.slice(0, commaIndex + 1).trim();
                    text = currentLine.slice(commaIndex + 1).trim() + ' ' + text;
                }
            }

            // Add the line to result and continue
            result += currentLine + '\n';
        }

        return result.trim();
    };

    // On #range input change, update maxLength and save to local storage
    $('#range').on('input', function() {
        maxLength = parseInt($(this).val());
        localStorage.setItem('maxLength', maxLength); // Save to local storage
    });

    // On #input textarea change, convert and copy to clipboard
    $('#input').on('input', function() {
        convertAndCopy();
    });

    // On paste button click, paste text from clipboard into #input
    $('#paste').on('click', function() {
        navigator.clipboard.readText().then(function(text) {
            $('#input').val(text); // Paste text into #input
            convertAndCopy(); // Convert and copy after pasting
        }).catch(function(err) {
            console.error('Failed to read clipboard contents: ', err);
        });
    });
});
