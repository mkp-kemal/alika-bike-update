 //TRUNCATE TEXT
 function TruncateText(text, maxText) {
    if (text.length > maxText) {
        return text.slice(0, maxText) + "...";
    }
    return text;
}

export default TruncateText