package pr.sector51.server.persistence.model;

public class KeyValuePair {
    private final Object key;
    private final Object value;

    public KeyValuePair(Object key, Object value) {
        this.key = key;
        this.value = value;
    }

    public Object getKey() {
        return key;
    }

    public Object getValue() {
        return value;
    }
}
