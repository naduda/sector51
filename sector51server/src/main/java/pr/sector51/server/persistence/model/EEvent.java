package pr.sector51.server.persistence.model;

public enum EEvent {
    SCANNER(0);

    private int id;
    EEvent(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }
}
