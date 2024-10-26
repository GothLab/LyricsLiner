$(document).ready(function() {
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

    // Enhanced function to add line breaks with additional handling for short lines
    const addLineBreaks = (text, maxLength) => {
        const words = text.split(' ');
        let currentLine = '';
        let result = '';

        words.forEach((word) => {
            if ((currentLine + word).length > maxLength) {
                // Avoid breaking if the resulting line would have less than 10 characters
                if (currentLine.trim().length < 10) {
                    currentLine += word + ' ';
                } else {
                    result += currentLine.trim() + '\n';
                    currentLine = word + ' ';
                }
            } else {
                currentLine += word + ' ';
            }
        });

        // If the last line is too short, check for comma to split or merge it with the previous line
        if (currentLine.trim().length < 10 && result.includes(',')) {
            // Try to split the last line based on commas if possible
            const lastCommaIndex = result.lastIndexOf(',');
            if (lastCommaIndex !== -1) {
                result = result.slice(0, lastCommaIndex + 1) + '\n' + currentLine.trim();
            } else {
                result += currentLine.trim();
            }
        } else {
            result += currentLine.trim(); // Add any remaining text to result
        }

        return result;
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
