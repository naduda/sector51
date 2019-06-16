package pr.sector.server.model;

public enum ERoleName {
    ROLE_USER("user", false),
    ROLE_ADMIN("admin", true);

    public final String label;
    public final boolean showPasswordField;
    ERoleName(String value, boolean pShowPasswordField) {
        label = value;
        showPasswordField = pShowPasswordField;
    }
}