package android.net; public class Uri {
 private final String value; private Uri(String v){value=v;} public static Uri parse(String v){return new Uri(v);} public String toString(){return value;}
 public static String encode(String v){try{return java.net.URLEncoder.encode(v,"UTF-8").replace("+","%20");}catch(Exception e){throw new RuntimeException(e);}}
 public static String decode(String v){try{return java.net.URLDecoder.decode(v,"UTF-8");}catch(Exception e){throw new RuntimeException(e);}}
}
