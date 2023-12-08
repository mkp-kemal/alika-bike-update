 //TRUNCATE TEXT
 function TruncateText(text) {
    if (text.length > 40) {
        return text.slice(0, 40) + "...";
    }
    return text;
}

export default TruncateText