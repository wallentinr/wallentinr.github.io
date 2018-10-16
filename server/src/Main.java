
import is.iclt.icenlp.core.icemorphy.IceMorphyLexicons;
import is.iclt.icenlp.core.icetagger.IceTaggerLexicons;
import is.iclt.icenlp.core.tokenizer.Sentences;
import is.iclt.icenlp.core.utils.Lexicon;
import is.iclt.icenlp.facade.IceParserFacade;
import is.iclt.icenlp.facade.IceTaggerFacade;
import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;

/*
* This is a project in Natural Language Processing at the University of Reykjavik
*
* Authors: Carl Rosén and Edda Peturs
*
* */


public class Main {


    public Main(){}

    public static void main(String[] args) throws IOException{

        Sentences tagged_sentences = tag("Gott kvöld");
        String parsed_sentence = parse(tagged_sentences);

    }

    public static String parse(Sentences sentences) throws IOException{
        IceParserFacade iceParserFacade = new IceParserFacade();
        String out = iceParserFacade.parse(sentences.toString(), true,true);

        System.out.println("Parsed sentence: " + out);
        return out;
    }

    public static Sentences tag(String string) throws IOException{

        IceTaggerLexicons iceLexicons = new IceTaggerLexicons("src/icetagger/");

        IceMorphyLexicons morphyLexicons = new IceMorphyLexicons("src/icetagger/");

        Lexicon lexicon = new Lexicon();
        lexicon.load("src/lexicon.txt");


        String lex = "src/lexicon.txt";

        lexicon.load(lex);


        IceTaggerFacade iceTagger = new IceTaggerFacade(iceLexicons, morphyLexicons, lexicon);

        Sentences sentences = new Sentences();

        sentences = iceTagger.tag(string);

        System.out.println("Tagged sentence: " + sentences.toString());


        return sentences;
    }

}
