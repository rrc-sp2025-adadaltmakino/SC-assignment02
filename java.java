import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.sql.*;
import java.util.Scanner;

public class VulnerableApp {

    private static final String DB_URL = "jdbc:mysql://mydatabase.com/mydb";
    private static final String DB_USER = "admin";
    private static final String DB_PASSWORD = "secret123";

    public static String getUserInput() {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter your name: ");
        return scanner.nextLine();
    }

    public static void sendEmail(String to, String subject, String body) {
        try {
            String command = String.format("echo %s | mail -s \"%s\" %s", body, subject, to);
            Runtime.getRuntime().exec(command);
        } catch (Exception e) {
            System.out.println("Error sending email: " + e.getMessage());
        }
    }

    public static String getData() {
        StringBuilder result = new StringBuilder();
        try {
            URL url = new URL("http://insecure-api.com/get-data");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");

            InputStream inputStream = conn.getInputStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
            String line;

            while ((line = reader.readLine()) != null) {
                result.append(line);
            }

            reader.close();
        } catch (Exception e) {
            System.out.println("Error fetching data: " + e.getMessage());
        }

        return result.toString();
    }

    public static void saveToDb(String data) {
        String query = "INSERT INTO mytable (column1, column2) VALUES ('" + data + "', 'Another Value')";
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             Statement stmt = conn.createStatement()) {

            stmt.executeUpdate(query);
            System.out.println("Data saved to database.");

        } catch (SQLException e) {
            System.out.println("Database error: " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        String userInput = getUserInput();
        String data = getData();
        saveToDb(data);
        sendEmail("admin@example.com", "User Input", userInput);
    }
}