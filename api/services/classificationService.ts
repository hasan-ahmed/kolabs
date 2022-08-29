import { DATASET } from "./dataset";

var natural = require('natural');
export const classifyRequest = async(title: string): Promise<string> => {
    var classifier = new natural.BayesClassifier();
    for (let data of DATASET) {
        classifier.addDocument(data.title, data.label);
    }
    classifier.train();
    return (classifier.classify(title));
}