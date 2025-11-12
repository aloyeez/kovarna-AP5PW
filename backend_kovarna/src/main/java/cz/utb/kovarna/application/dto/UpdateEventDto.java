package cz.utb.kovarna.application.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateEventDto {

    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    private String description;

    private LocalDate eventDate;

    private Boolean isActive;
}
