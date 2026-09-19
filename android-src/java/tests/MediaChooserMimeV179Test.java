import java.lang.reflect.Method;

/** JVM checks of the actual compiled helper; not a device/URI-grant simulation. */
public final class MediaChooserMimeV179Test {
    public static void main(String[] args) throws Exception {
        Class<?> helper = Class.forName("com.aiderlog.v22app.MediaChooserV178");
        Method unknown = helper.getDeclaredMethod("unknownMime", String.class);
        Method accepted = helper.getDeclaredMethod("accepted", String[].class, String.class);
        unknown.setAccessible(true);
        accepted.setAccessible(true);
        Object[][] cases = new Object[][] {
            {null, true}, {"", true}, {"   ", true}, {"application/octet-stream", true},
            {" APPLICATION/OCTET-STREAM ", true}, {"image/jpeg", true}, {"image/heic", true},
            {"video/mp4", true}, {"video/quicktime", true}, {"text/html", false},
            {"application/javascript", false}, {"application/pdf", false}
        };
        int checks = 0;
        for (Object[] row : cases) {
            String actual = (String) row[0];
            boolean allow = (Boolean) unknown.invoke(null, actual)
                || (Boolean) accepted.invoke(null, new String[] {"image/*", "video/*"}, actual.trim());
            if (allow != (Boolean) row[1]) throw new AssertionError("MIME case " + checks);
            checks++;
        }
        if ((Boolean) accepted.invoke(null, new String[] {"image/*"}, "video/mp4"))
            throw new AssertionError("Image-only inputs must still reject known video MIME");
        checks++;
        if (!(Boolean) accepted.invoke(null, new String[] {"*/*"}, "application/pdf"))
            throw new AssertionError("Document inputs must keep supported PDFs");
        checks++;
        System.out.println("MediaChooser MIME boundary: " + checks + " checks passed (JVM, not device)");
    }
}
