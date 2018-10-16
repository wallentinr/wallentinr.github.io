
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.Charset;
import java.util.*;

/*
 * This is a project in Natural Language Processing at the University of Reykjavik
 *
 *  Authors: Carl Rosén and Edda Peturs
 *
 * The server is hosted locally on http://localhost:9000/
 * To get a parsed sentence back call http://localhost:9000/Get?string=word1-word2-word3
 *
 * */


public class server {

    public int port = 9000;

    public static void main(String[] args) throws Exception {

        int port = 9000;
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

        System.out.println("server started at " + port);
        server.createContext("/", new RootHandler());
        server.createContext("/Get", new GetHandler());
        server.setExecutor(null);
        server.start();
    }

    public static void parseQuery(String query, Map<String,
            Object> parameters) throws UnsupportedEncodingException {

        if (query != null) {
            String pairs[] = query.split("[&]");
            for (String pair : pairs) {
                String param[] = pair.split("[=]");
                String key = null;
                String value = null;
                if (param.length > 0) {
                    key = URLDecoder.decode(param[0],
                            System.getProperty("file.encoding"));
                }

                if (param.length > 1) {
                    value = URLDecoder.decode(param[1],
                            System.getProperty("file.encoding"));
                }

                if (parameters.containsKey(key)) {
                    Object obj = parameters.get(key);
                    if (obj instanceof List<?>) {
                        List<String> values = (List<String>) obj;
                        values.add(value);

                    } else if (obj instanceof String) {
                        List<String> values = new ArrayList<String>();
                        values.add((String) obj);
                        values.add(value);
                        parameters.put(key, values);
                    }
                } else {
                    parameters.put(key, value);
                }
            }
        }
    }



}

class RootHandler implements HttpHandler {

    @Override

    public void handle(HttpExchange he) throws IOException {
        String response = "<h1>This is the Malfridur server</h1>" + "<h1>Port: " + "9000 " + "</h1>";
        he.sendResponseHeaders(200, response.length());
        OutputStream os = he.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }
}



class GetHandler implements HttpHandler {

    @Override

    public void handle(HttpExchange he) throws IOException {
        // parse request
        Map<String, Object> parameters = new HashMap<String, Object>();
        URI requestedUri = he.getRequestURI();
        String query = requestedUri.getRawQuery();
        server.parseQuery(query, parameters);

        // send response
        String response = parameters.get("string").toString();
        response =response.replaceAll("-", " ");
        response = Main.parse(Main.tag(response));

        response = response.replaceAll("-", " ");
        for (String key : parameters.keySet())
            response += key + " = " + parameters.get(key) + "\n";
        he.sendResponseHeaders(200, response.length());
        OutputStream os = he.getResponseBody();
        System.out.println("Respons: " + response);
        os.write(response.getBytes(Charset.forName("ISO-8859-1")));

        os.close();
    }
}
