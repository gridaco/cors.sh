import { Check } from "@mui/icons-material";

export default function CheckFilled({
  color = "black",
  size = 24,
}: {
  size?: number;
  color?: string;
}) {
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: color,
      }}
    >
      <Check
        sx={{
          fontSize: size * 0.8,
          color: "white",
        }}
      />
    </span>
  );
}
